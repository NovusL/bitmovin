var conf = {
  key: "bdb06f18-02da-4637-a314-e41fd6f94665",
  // Disable built-in UI
  // (instead we load the UI files ourselves and create the UI instance after the player setup)
  ui: false,
  playback: {
      autoplay: true,
      muted: false,
      preferredTech: [{
              player: 'flash',
              streaming: 'hls'
          },
          {
              player: 'html5',
              streaming: 'dash'
          }
      ]
  }
};

var source = {
  dash: "https://s3-us-west-1.amazonaws.com/test-steam-out/Piano-song/dash/stream.mpd",
  hls: "https://s3-us-west-1.amazonaws.com/test-steam-out/Piano-song/hls/master.m3u8",
  title: "Sintel",
  poster: "https://bitmovin.com/wp-content/uploads/2016/06/sintel-poster.jpg",
  //- For testing subtitle and audio
  //dash: "https://bitdash-a.akamaihd.net/content/sintel/sintel.mpd",
  //hls: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8",
  drm: {
      widevine: {
          LA_URL: "https://wv.service.expressplay.com/hms/wv/rights/?ExpressPlayToken=BAAAABMlKewAAABgFTxKUiFuWZU-e4GAVp9USnXmqZXlbWdN9SNlYzFo9f6aZuBPTbyJcdqTuan_-L9f5i-upZ42C2e_HpsByS-4zdRJxaJIU2yhBqMY4vACaxfuSV8sBtrGfiJ5Lq-6Wx9oneDGl5TV_WY-w-Y23pPb41IV2fg"
      },
      playready: {
          LA_URL: "http://pr.service.expressplay.com/playready/RightsManager.asmx",
          customData: "AgAAABMlN4MAAABwBsuksAAsE-YRHhekveloD-FIXIjnmhnpCGyYsC2mP8bO6Q6dyH2YUk42PN0noEXcBdbJgYzmyYieGFE-FiTlZrKKMhnUfql4WTaijYNL-WO2n_bPzRScp7zdrz64h089R-IU_XAdflOz-2a_u_Gbi9eOq4KG4zXpYfucfCBJi0PO6VL3"
      },
      //- fairplay: {
      //-     certificateURL: `${myJson.fpCER}`,
      //-     LA_URL: `${myJson.fpURL}`,
      //-     //- certificateURL: "http://localhost:3000/fairplay.cer",
      //-     //- LA_URL: "http://fp.service.expressplay.com/hms/fp/rights/?ExpressPlayToken=AQAAABMlKbMAAABQ3dQMexhlbKhbk1hlxGU3-wJwGUnAkP3fQvdOvqIPPdCwmwcLUZKWQfrVBrzF60RHVlQd3yKSeDVw0rveo-PgIVziMDs89AQiI38y2I_Ucf-Ql_mNpsC1pRN2bncsOL727VdrRw",

      //-     //- headers: {
      //-     //-     'Content-Type': 'application/json',
      //-     //- },
      //-     headers:{  
      //-         'content-type': 'application/octet-stream',
      //-         //- name:'Content-type',
      //-         //- value:'application/octet-stream'
      //-     },

      //-     prepareMessage:(event, session) => {  
      //-         return event.message;
      //-     },
      //-     prepareContentId:(contentId) => {  
      //-         var link = document.createElement('a'); 
      //-         link.href = contentId; 
      //-         return link.hostname;
      //-     },
      //-     prepareLicense:(license) => {  
      //-         return new Uint8Array(license);
      //-     },
      //-     licenseResponseType: 'arraybuffer'
      //-     }  
      fairplay: {
          LA_URL: "http://fp.service.expressplay.com/hms/fp/rights/?ExpressPlayToken=AQAAABMlKbUAAABQz8g-DpHKUSccBkcRPs5wxsxI93LMZsVhX7BQaz6EVUIwk7TONDBncWSlMh4fwnJ7yEqe0v6Ecs0USpgbKahtUzzFFEOwbe8G664ILifryzMongi-cL3kxmFDjqQ1B2MqDzG5Yw",
          certificateURL: "https://s3-us-west-1.amazonaws.com/test-steam-out/fairplay.cer",
          prepareMessage: function(event, session) {
              return event.message;
          },
          prepareContentId: function(contentId) {
              var link = document.createElement('a');
              link.href = contentId;
              return link.hostname;
          },
          prepareLicense: function(license) {
              return new Uint8Array(license);
          },
          headers: [{
              name: 'Content-type',
              value: 'application/octet-stream'
          }],
          useUint16InitData: true,
          licenseResponseType: 'arraybuffer'
      }

  }
};


var player = new bitmovin.player.Player(document.getElementById("movie-player"), conf);

// Create UI instance
var uiManager = new bitmovin.playerui.UIManager(player, createUIContainer());


// Setup the player
player.load(source).then(() => {
  console.log('Source loaded successful')
}, function() {
  console.log('Error while loading source');
});




function createUIContainer() {
  let subtitleOverlay = new bitmovin.playerui.SubtitleOverlay();

  let settingsPanel = new bitmovin.playerui.SettingsPanel({
      components: [
          new bitmovin.playerui.SettingsPanelPage({
              components: [
                  new bitmovin.playerui.SettingsPanelItem('Video Quality', new bitmovin.playerui.VideoQualitySelectBox()),
                  new bitmovin.playerui.SettingsPanelItem('Speed', new bitmovin.playerui.PlaybackSpeedSelectBox()),
                  new bitmovin.playerui.SettingsPanelItem('Audio Quality', new bitmovin.playerui.AudioQualitySelectBox()),
              ],
          }),
      ],
      hidden: true,
  });

  let subtitleListBox = new bitmovin.playerui.SubtitleListBox();

  let subtitleListBoxSettingsPanelPage = new bitmovin.playerui.SettingsPanelPage({
      components: [
          new bitmovin.playerui.SettingsPanelItem(null, subtitleListBox),
      ],
  });

  let subtitleSettingsPanel = new bitmovin.playerui.SettingsPanel({
      components: [
          subtitleListBoxSettingsPanelPage,
      ],
      hidden: true,
      pageTransitionAnimation: false,
  });

  let subtitleSettingsPanelPage = new bitmovin.playerui.SubtitleSettingsPanelPage({
      settingsPanel: subtitleSettingsPanel,
      overlay: subtitleOverlay,
  });

  let subtitleSettingsOpenButton = new bitmovin.playerui.SettingsPanelPageOpenButton({
      targetPage: subtitleSettingsPanelPage,
      container: subtitleSettingsPanel,
      text: 'Settings',
      cssClasses: ['customization-open-button']
  });

  subtitleListBoxSettingsPanelPage.addComponent(
      new bitmovin.playerui.SettingsPanelItem(null, subtitleSettingsOpenButton, {
          cssClasses: ['subtitle-customization-settings-panel-item']
      })
  );
  subtitleSettingsPanel.addComponent(subtitleSettingsPanelPage);

  let audioTrackListBox = new bitmovin.playerui.AudioTrackListBox();
  let audioTrackSettingsPanel = new bitmovin.playerui.SettingsPanel({
      components: [
          new bitmovin.playerui.SettingsPanelPage({
              components: [
                  new bitmovin.playerui.SettingsPanelItem(null, audioTrackListBox),
              ],
          }),
      ],
      hidden: true,
  });

  let controlBar = new bitmovin.playerui.ControlBar({
      components: [
          audioTrackSettingsPanel,
          subtitleSettingsPanel,
          settingsPanel,
          new bitmovin.playerui.Container({
              components: [
                  new bitmovin.playerui.PlaybackTimeLabel({
                      timeLabelMode: bitmovin.playerui.PlaybackTimeLabelMode.CurrentTime,
                      hideInLivePlayback: true
                  }),
                  new bitmovin.playerui.SeekBar({
                      label: new bitmovin.playerui.SeekBarLabel()
                  }),
                  new bitmovin.playerui.PlaybackTimeLabel({
                      timeLabelMode: bitmovin.playerui.PlaybackTimeLabelMode.TotalTime,
                      cssClasses: ['text-right']
                  }),
              ],
              cssClasses: ['controlbar-top'],
          }),
          new bitmovin.playerui.Container({
              components: [
                  new bitmovin.playerui.PlaybackToggleButton(),
                  new bitmovin.playerui.VolumeToggleButton(),
                  new bitmovin.playerui.VolumeSlider(),
                  new bitmovin.playerui.Spacer(),
                  new bitmovin.playerui.PictureInPictureToggleButton(),
                  new bitmovin.playerui.AirPlayToggleButton(),
                  new bitmovin.playerui.CastToggleButton(),
                  new bitmovin.playerui.VRToggleButton(),
                  new bitmovin.playerui.SettingsToggleButton({
                      settingsPanel: audioTrackSettingsPanel,
                      cssClass: 'ui-audiotracksettingstogglebutton',
                  }),
                  new bitmovin.playerui.SettingsToggleButton({
                      settingsPanel: subtitleSettingsPanel,
                      cssClass: 'ui-subtitlesettingstogglebutton',
                  }),
                  new bitmovin.playerui.SettingsToggleButton({
                      settingsPanel: settingsPanel
                  }),
                  new bitmovin.playerui.FullscreenToggleButton(),
              ],
              cssClasses: ['controlbar-bottom'],
          }),
      ],
  });

  return new bitmovin.playerui.UIContainer({
      components: [
          subtitleOverlay,
          new bitmovin.playerui.BufferingOverlay(),
          new bitmovin.playerui.PlaybackToggleOverlay(),
          new bitmovin.playerui.CastStatusOverlay(),
          controlBar,
          new bitmovin.playerui.TitleBar(),
          new bitmovin.playerui.RecommendationOverlay(),
          new bitmovin.playerui.Watermark(),
          new bitmovin.playerui.ErrorMessageOverlay(),
      ],
  });
}