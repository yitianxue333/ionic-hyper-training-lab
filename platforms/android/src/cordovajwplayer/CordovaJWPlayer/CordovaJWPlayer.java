package cordovajwplayer;

import android.app.Activity;
import android.content.pm.ActivityInfo;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CallbackContext;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONException;

import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;

import com.longtailvideo.jwplayer.JWPlayerView;
import com.longtailvideo.jwplayer.media.playlists.MediaSource;
import com.longtailvideo.jwplayer.events.listeners.VideoPlayerEvents;
import com.longtailvideo.jwplayer.media.playlists.PlaylistItem;
import com.longtailvideo.jwplayer.configuration.PlayerConfig;
import com.longtailvideo.jwplayer.configuration.Skin;
import com.longtailvideo.jwplayer.fullscreen.FullscreenHandler;

import java.util.*;

/**
 * This class echoes a string called from JavaScript.
 */
public class CordovaJWPlayer extends CordovaPlugin implements   VideoPlayerEvents.OnFullscreenListener{

	/**
	 * Reference to the {@link JWPlayerView}
	 */
	private JWPlayerView mPlayerView;


	private Activity mActivity;

	private boolean onlyFullScreen;

	public static final String ACTION_SETUP = "setup";
	public static final String ACTION_PLAY = "play";
	public static final String ACTION_SET_PLAYLIST = "setJWPlaylist";
	
	private static final String TAG = "CordovaJWPlayer";

    private ViewGroup mRootView;

	private View mDecorView;

	private List<PlaylistItem> mPlayList = new ArrayList<PlaylistItem>();

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {
		
        if (ACTION_SETUP.equals(action)) {
            JSONObject options = null;
            JSONArray playlist = null;
			
			options = args.getJSONObject(0);
			playlist = args.getJSONArray(1);
            setup(options, playlist, callbackContext);
            return true;
        } 
		
		if(ACTION_PLAY.equals(action)) {
			int index = args.getInt(0);
			play(index);
		}

		if(ACTION_SET_PLAYLIST.equals(action)) {
			JSONArray playlist = null;
			playlist = args.getJSONArray(0);
			callbackContext.success();
		}

        return false;
    }

    private void setup(JSONObject options,JSONArray  playlist, CallbackContext callbackContext) {
		try{
			if(playlist != null) {
				setPlaylist(playlist);
			}

            callbackContext.success();
		} catch (Exception e) {
			callbackContext.error(e.toString());
		}
    }

    private void setPlaylist(JSONArray playlist) throws JSONException {
		mPlayList.clear();
		for(int i=0; i < playlist.length(); i++) {
			PlaylistItem pl = new PlaylistItem();
			List<MediaSource> mediaSources = new ArrayList<MediaSource>();

			JSONObject plItem = playlist.getJSONObject(i);
			if(plItem.has("sources")) {
				JSONArray sources = plItem.getJSONArray("sources");
				for(int x=0; x < sources.length(); x++) {
					JSONObject source = sources.getJSONObject(x);
					MediaSource ms = new MediaSource();

					ms.setFile(source.getString("file"));
					if(source.has("label")) {
						ms.setLabel(source.getString("label"));
					}
					if(source.has("isDefault")) {
						ms.setDefault(source.getBoolean("isDefault"));
					}
					mediaSources.add(ms);
				}
			}

			pl.setSources(mediaSources);

			if(plItem.has("mediaid")) {
				pl.setMediaId(plItem.getString("mediaid"));
			}

			if(plItem.has("image")) {
				pl.setImage(plItem.getString("image"));
			}

			if(plItem.has("title")) {
				pl.setTitle(plItem.getString("title"));
			}

			mPlayList.add(pl);
		}
	}

	private void play(int index) {

		final CordovaJWPlayer cwp = this;
		final int playIndex = index;

		// Create dialog in new thread
		cordova.getActivity().runOnUiThread(new Runnable() {
			public void run() {

				mActivity = cordova.getActivity();
				mRootView = (ViewGroup) cordova.getActivity().getWindow().getDecorView().findViewById(android.R.id.content);
				mDecorView = cordova.getActivity().getWindow().getDecorView();
				mPlayerView = new JWPlayerView(mActivity, new PlayerConfig.Builder().build());

				mPlayerView.setFullscreenHandler(new PlayerFullscreenHandler());

				List<PlaylistItem> pl = new ArrayList<PlaylistItem>();


				//AdvertisingBase advertising;
				//hideSystemUI();

				// Enter portrait mode
				mActivity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);

				mPlayerView.addOnFullscreenListener(cwp);


				// Destroy the surface that is used for video output, we need to do this before
				// we can detach the JWPlayerView from a ViewGroup.
                mPlayerView.destroySurface();

				// Remove the player view from the root ViewGroup.
				mRootView.removeView(mPlayerView);

				// After we've detached the JWPlayerView we can safely reinitialize the surface.
				//dPlayerView.initializeSurface();

				// Restore the listview-skin
				mPlayerView.setSkin(Skin.GLOW);
				mPlayerView.initializeSurface();
				mPlayerView.load(mPlayList);
				mPlayerView.playlistItem(playIndex);
				mPlayerView.setFullscreen(true, true);
				// Add the JWPlayerView to the RootView as soon as the UI thread is ready.
				mRootView.post(new Runnable() {
					@Override
					public void run() {
						mRootView.addView(mPlayerView, new ViewGroup.LayoutParams(
								ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
					}
				});

			}
		});
	}

    /**
     * Shows the system ui.
     */
    private void showSystemUI() {
		cordova.getActivity().runOnUiThread(new Runnable() {
			public void run() {
				mDecorView.setSystemUiVisibility(
						View.SYSTEM_UI_FLAG_LAYOUT_STABLE
								| View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
								| View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN);
			}});

    }

    /**
     * Hides the system ui.
     */
    private void hideSystemUI() {
		cordova.getActivity().runOnUiThread(new Runnable() {
			public void run() {
				mDecorView.setSystemUiVisibility(
						View.SYSTEM_UI_FLAG_LAYOUT_STABLE
								| View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
								| View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
								| View.SYSTEM_UI_FLAG_HIDE_NAVIGATION // hide nav bar
								| View.SYSTEM_UI_FLAG_FULLSCREEN // hide status bar
								| View.SYSTEM_UI_FLAG_IMMERSIVE);
			}
		});
    }

	private void updateOutput(String output) {
		Log.e(TAG, output);
	}

	/**
	 * Regular playback events below here
	 */
	public void onFullscreen(boolean fullscreen) {
		final boolean fScreen = fullscreen;
		cordova.getActivity().runOnUiThread(new Runnable() {
			public void run() {
				updateOutput("onFullscreen(" + fScreen + ")");
				if (!fScreen) {
					mPlayerView.stop();
					//showSystemUI();

					// Enter portrait mode
					mActivity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);

					// Remove the player view from the root ViewGroup.
					mRootView.removeView(mPlayerView);
				} else {
					mActivity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
				}
			}
		});
	}

//  TODO Implement events fr Pause and Play
//	public void onPause(PlayerState oldState) {
//		updateOutput("onPause(" + oldState + ")");
//	}
//
//	public void onPlay(PlayerState oldState) {
//		updateOutput("onPlay(" + oldState + ")");
//	}

	private class PlayerFullscreenHandler implements FullscreenHandler {

		public PlayerFullscreenHandler() {
		}

		@Override
		public void onFullscreenRequested() {
			mActivity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
		}

		@Override
		public void onFullscreenExitRequested() {
			mActivity.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
		}

		@Override
		public void onResume() {

		}

		@Override
		public void onPause() {

		}

		@Override
		public void onDestroy() {

		}

		@Override
		public void onAllowRotationChanged(boolean allowRotation) {

		}

		@Override
		public void updateLayoutParams(ViewGroup.LayoutParams layoutParams) {

		}

		@Override
		public void setUseFullscreenLayoutFlags(boolean useFlags) {

		}
	}
}