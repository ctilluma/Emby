define(["browser"],function(browser){"use strict";function canPlayH264(videoTestElement){return!(!videoTestElement.canPlayType||!videoTestElement.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"').replace(/no/,""))}function canPlayH265(videoTestElement,options){if(browser.tizen||browser.orsay||browser.xboxOne||options.supportsHevc)return!0;var userAgent=navigator.userAgent.toLowerCase();if(browser.chromecast){var isChromecastUltra=userAgent.indexOf("aarch64")!==-1;if(isChromecastUltra)return!0}return!(!videoTestElement.canPlayType||!videoTestElement.canPlayType('video/hevc; codecs="hevc, aac"').replace(/no/,""))}function supportsTextTracks(){return!(!browser.tizen&&!browser.orsay)||(null==_supportsTextTracks&&(_supportsTextTracks=null!=document.createElement("video").textTracks),_supportsTextTracks)}function canPlayHls(src){return null==_canPlayHls&&(_canPlayHls=canPlayNativeHls()||canPlayHlsWithMSE()),_canPlayHls}function canPlayNativeHls(){if(browser.tizen||browser.orsay)return!0;var media=document.createElement("video");return!(!media.canPlayType("application/x-mpegURL").replace(/no/,"")&&!media.canPlayType("application/vnd.apple.mpegURL").replace(/no/,""))}function canPlayHlsWithMSE(){return null!=window.MediaSource}function canPlayAudioFormat(format){var typeString;if("flac"===format){if(browser.tizen||browser.orsay)return!0;if(browser.edgeUwp)return!0}else if("wma"===format){if(browser.tizen||browser.orsay)return!0;if(browser.edgeUwp)return!0}else{if("opus"===format)return typeString='audio/ogg; codecs="opus"',!!document.createElement("audio").canPlayType(typeString).replace(/no/,"");if("mp2"===format)return!1}if("webma"===format)typeString="audio/webm";else if("mp2"===format)typeString="audio/mpeg";else if("ogg"===format||"oga"===format){if(browser.chrome)return!1;typeString="audio/"+format}else typeString="audio/"+format;return!!document.createElement("audio").canPlayType(typeString).replace(/no/,"")}function testCanPlayMkv(videoTestElement){if(browser.tizen||browser.orsay)return!0;if(videoTestElement.canPlayType("video/x-matroska").replace(/no/,"")||videoTestElement.canPlayType("video/mkv").replace(/no/,""))return!0;var userAgent=navigator.userAgent.toLowerCase();return browser.chrome?!browser.operaTv&&(userAgent.indexOf("vivaldi")===-1&&userAgent.indexOf("opera")===-1):!!browser.edgeUwp}function testCanPlayTs(){return browser.tizen||browser.orsay||browser.web0s||browser.edgeUwp}function supportsMpeg2Video(){return browser.orsay||browser.tizen||browser.edgeUwp}function supportsVc1(){return browser.orsay||browser.tizen||browser.edgeUwp}function getDirectPlayProfileForVideoContainer(container,videoAudioCodecs,videoTestElement,options){var supported=!1,profileContainer=container,videoCodecs=[];switch(container){case"asf":supported=browser.tizen||browser.orsay||browser.edgeUwp,videoAudioCodecs=[];break;case"avi":supported=browser.tizen||browser.orsay||browser.edgeUwp;break;case"mpg":case"mpeg":supported=browser.edgeUwp||browser.tizen||browser.orsay;break;case"flv":supported=browser.tizen||browser.orsay;break;case"3gp":case"mts":case"trp":case"vob":case"vro":supported=browser.tizen||browser.orsay;break;case"mov":supported=browser.tizen||browser.orsay||browser.chrome||browser.edgeUwp,videoCodecs.push("h264");break;case"m2ts":supported=browser.tizen||browser.orsay||browser.web0s||browser.edgeUwp,videoCodecs.push("h264"),supportsVc1()&&videoCodecs.push("vc1"),supportsMpeg2Video()&&videoCodecs.push("mpeg2video");break;case"wmv":supported=browser.tizen||browser.orsay||browser.web0s||browser.edgeUwp,videoAudioCodecs=[];break;case"ts":supported=testCanPlayTs(),videoCodecs.push("h264"),canPlayH265(videoTestElement,options)&&(videoCodecs.push("h265"),videoCodecs.push("hevc")),supportsVc1()&&videoCodecs.push("vc1"),supportsMpeg2Video()&&videoCodecs.push("mpeg2video"),profileContainer="ts,mpegts"}return supported?{Container:profileContainer,Type:"Video",VideoCodec:videoCodecs.join(","),AudioCodec:videoAudioCodecs.join(",")}:null}function getMaxBitrate(){return 12e7}function getGlobalMaxVideoBitrate(){var userAgent=navigator.userAgent.toLowerCase();if(browser.chromecast){var isChromecastUltra=userAgent.indexOf("aarch64")!==-1;return isChromecastUltra?8e7:1e7}var isTizenFhd=!1;if(browser.tizen)try{var isTizenUhd=webapis.productinfo.isUdPanelSupported();isTizenFhd=!isTizenUhd,console.log("isTizenFhd = "+isTizenFhd)}catch(error){console.log("isUdPanelSupported() error code = "+error.code)}return browser.ps4?8e6:browser.xboxOne?12e6:browser.edgeUwp?4e7:browser.tizen&&isTizenFhd?2e7:null}function supportsAc3(videoTestElement){return!!(browser.edgeUwp||browser.tizen||browser.orsay||browser.web0s)||videoTestElement.canPlayType('audio/mp4; codecs="ac-3"').replace(/no/,"")&&!browser.osx&&!browser.iOS}function supportsEac3(videoTestElement){return!!(browser.tizen||browser.orsay||browser.web0s)||videoTestElement.canPlayType('audio/mp4; codecs="ec-3"').replace(/no/,"")}var _supportsTextTracks,_canPlayHls;return function(options){options=options||{};var physicalAudioChannels=options.audioChannels||(browser.mobile?2:6),bitrateSetting=getMaxBitrate(),videoTestElement=document.createElement("video"),canPlayWebm=videoTestElement.canPlayType("video/webm").replace(/no/,""),canPlayMkv=testCanPlayMkv(videoTestElement),profile={};profile.MaxStreamingBitrate=bitrateSetting,profile.MaxStaticBitrate=1e8,profile.MusicStreamingTranscodingBitrate=Math.min(bitrateSetting,192e3),profile.DirectPlayProfiles=[];var videoAudioCodecs=[],hlsVideoAudioCodecs=[],supportsMp3VideoAudio=videoTestElement.canPlayType('video/mp4; codecs="avc1.640029, mp4a.69"').replace(/no/,"")||videoTestElement.canPlayType('video/mp4; codecs="avc1.640029, mp4a.6B"').replace(/no/,""),supportsMp2VideoAudio=browser.edgeUwp||browser.tizen||browser.orsay;if(supportsAc3(videoTestElement)){videoAudioCodecs.push("ac3");var eAc3=supportsEac3(videoTestElement);eAc3&&videoAudioCodecs.push("eac3"),browser.edge&&browser.touch&&!browser.edgeUwp||(hlsVideoAudioCodecs.push("ac3"),eAc3&&hlsVideoAudioCodecs.push("eac3"))}var mp3Added=!1;canPlayMkv&&supportsMp3VideoAudio&&(mp3Added=!0,videoAudioCodecs.push("mp3")),videoTestElement.canPlayType('video/mp4; codecs="avc1.640029, mp4a.40.2"').replace(/no/,"")&&(videoAudioCodecs.push("aac"),hlsVideoAudioCodecs.push("aac")),supportsMp3VideoAudio&&(mp3Added||videoAudioCodecs.push("mp3"),browser.ps4||hlsVideoAudioCodecs.push("mp3")),supportsMp2VideoAudio&&videoAudioCodecs.push("mp2"),(browser.tizen||browser.orsay||options.supportsDts)&&(videoAudioCodecs.push("dca"),videoAudioCodecs.push("dts")),(browser.tizen||browser.orsay)&&(videoAudioCodecs.push("pcm_s16le"),videoAudioCodecs.push("pcm_s24le")),options.supportsTrueHd&&videoAudioCodecs.push("truehd"),videoAudioCodecs=videoAudioCodecs.filter(function(c){return(options.disableVideoAudioCodecs||[]).indexOf(c)===-1}),hlsVideoAudioCodecs=hlsVideoAudioCodecs.filter(function(c){return(options.disableHlsVideoAudioCodecs||[]).indexOf(c)===-1});var mp4VideoCodecs=[];canPlayH264(videoTestElement)&&mp4VideoCodecs.push("h264"),canPlayH265(videoTestElement,options)&&(mp4VideoCodecs.push("h265"),mp4VideoCodecs.push("hevc")),supportsMpeg2Video()&&mp4VideoCodecs.push("mpeg2video"),supportsVc1()&&mp4VideoCodecs.push("vc1"),(browser.tizen||browser.orsay)&&mp4VideoCodecs.push("msmpeg4v2"),mp4VideoCodecs.length&&profile.DirectPlayProfiles.push({Container:"mp4,m4v",Type:"Video",VideoCodec:mp4VideoCodecs.join(","),AudioCodec:videoAudioCodecs.join(",")}),canPlayMkv&&mp4VideoCodecs.length&&profile.DirectPlayProfiles.push({Container:"mkv",Type:"Video",VideoCodec:mp4VideoCodecs.join(","),AudioCodec:videoAudioCodecs.join(",")}),["m2ts","wmv","ts","asf","avi","mpg","mpeg","flv","3gp","mts","trp","vob","vro","mov"].map(function(container){return getDirectPlayProfileForVideoContainer(container,videoAudioCodecs,videoTestElement,options)}).filter(function(i){return null!=i}).forEach(function(i){profile.DirectPlayProfiles.push(i)}),["opus","mp3","mp2","aac","flac","alac","webma","wma","wav","ogg","oga"].filter(canPlayAudioFormat).forEach(function(audioFormat){"mp2"===audioFormat?profile.DirectPlayProfiles.push({Container:"mp2,mp3",Type:"Audio",AudioCodec:audioFormat}):"mp3"===audioFormat?profile.DirectPlayProfiles.push({Container:audioFormat,Type:"Audio",AudioCodec:audioFormat}):profile.DirectPlayProfiles.push({Container:"webma"===audioFormat?"webma,webm":audioFormat,Type:"Audio"}),"aac"!==audioFormat&&"alac"!==audioFormat||profile.DirectPlayProfiles.push({Container:"m4a",AudioCodec:audioFormat,Type:"Audio"})}),canPlayWebm&&profile.DirectPlayProfiles.push({Container:"webm",Type:"Video",AudioCodec:"vorbis",VideoCodec:"VP8,VP9"}),profile.TranscodingProfiles=[],canPlayHls()&&browser.enableHlsAudio!==!1&&profile.TranscodingProfiles.push({Container:!canPlayNativeHls()||browser.edge||browser.android?"ts":"aac",Type:"Audio",AudioCodec:"aac",Context:"Streaming",Protocol:"hls",MaxAudioChannels:physicalAudioChannels.toString(),MinSegments:browser.iOS||browser.osx?"2":"1",BreakOnNonKeyFrames:!(!browser.iOS&&!browser.osx&&canPlayNativeHls())}),["aac","mp3","opus","wav"].filter(canPlayAudioFormat).forEach(function(audioFormat){profile.TranscodingProfiles.push({Container:audioFormat,Type:"Audio",AudioCodec:audioFormat,Context:"Streaming",Protocol:"http",MaxAudioChannels:physicalAudioChannels.toString()})}),["opus","mp3","aac","wav"].filter(canPlayAudioFormat).forEach(function(audioFormat){profile.TranscodingProfiles.push({Container:audioFormat,Type:"Audio",AudioCodec:audioFormat,Context:"Static",Protocol:"http",MaxAudioChannels:physicalAudioChannels.toString()})}),!canPlayMkv||browser.tizen||browser.orsay||options.enableMkvProgressive===!1||profile.TranscodingProfiles.push({Container:"mkv",Type:"Video",AudioCodec:videoAudioCodecs.join(","),VideoCodec:mp4VideoCodecs.join(","),Context:"Streaming",MaxAudioChannels:physicalAudioChannels.toString(),CopyTimestamps:!0}),canPlayMkv&&profile.TranscodingProfiles.push({Container:"mkv",Type:"Video",AudioCodec:videoAudioCodecs.join(","),VideoCodec:"h264",Context:"Static",MaxAudioChannels:physicalAudioChannels.toString(),CopyTimestamps:!0}),canPlayHls()&&options.enableHls!==!1&&profile.TranscodingProfiles.push({Container:"ts",Type:"Video",AudioCodec:hlsVideoAudioCodecs.join(","),VideoCodec:"h264",Context:"Streaming",Protocol:"hls",MaxAudioChannels:physicalAudioChannels.toString(),MinSegments:browser.iOS||browser.osx?"2":"1",BreakOnNonKeyFrames:!(!browser.iOS&&!browser.osx&&canPlayNativeHls())}),canPlayWebm&&profile.TranscodingProfiles.push({Container:"webm",Type:"Video",AudioCodec:"vorbis",VideoCodec:"vpx",Context:"Streaming",Protocol:"http",MaxAudioChannels:physicalAudioChannels.toString()}),profile.TranscodingProfiles.push({Container:"mp4",Type:"Video",AudioCodec:videoAudioCodecs.join(","),VideoCodec:"h264",Context:"Streaming",Protocol:"http",MaxAudioChannels:physicalAudioChannels.toString()}),profile.TranscodingProfiles.push({Container:"mp4",Type:"Video",AudioCodec:videoAudioCodecs.join(","),VideoCodec:"h264",Context:"Static",Protocol:"http"}),profile.ContainerProfiles=[],profile.CodecProfiles=[];var supportsSecondaryAudio=browser.tizen||browser.orsay||browser.edge||browser.msie;videoTestElement.canPlayType('video/mp4; codecs="avc1.640029, mp4a.40.5"').replace(/no/,"")||(profile.CodecProfiles.push({Type:"VideoAudio",Codec:"aac",Conditions:[{Condition:"NotEquals",Property:"AudioProfile",Value:"HE-AAC"}]}),supportsSecondaryAudio||profile.CodecProfiles[profile.CodecProfiles.length-1].Conditions.push({Condition:"Equals",Property:"IsSecondaryAudio",Value:"false",IsRequired:"false"})),supportsSecondaryAudio||profile.CodecProfiles.push({Type:"VideoAudio",Conditions:[{Condition:"Equals",Property:"IsSecondaryAudio",Value:"false",IsRequired:"false"}]});var maxH264Level=browser.chromecast?"42":"51";profile.CodecProfiles.push({Type:"Video",Codec:"h264",Conditions:[{Condition:"NotEquals",Property:"IsAnamorphic",Value:"true",IsRequired:!1},{Condition:"EqualsAny",Property:"VideoProfile",Value:"high|main|baseline|constrained baseline"},{Condition:"LessThanEqual",Property:"VideoLevel",Value:maxH264Level}]}),browser.edgeUwp||browser.tizen||browser.orsay||browser.web0s||(profile.CodecProfiles[profile.CodecProfiles.length-1].Conditions.push({Condition:"NotEquals",Property:"IsAVC",Value:"false",IsRequired:!1}),profile.CodecProfiles[profile.CodecProfiles.length-1].Conditions.push({Condition:"NotEquals",Property:"IsInterlaced",Value:"true",IsRequired:!1}));var globalMaxVideoBitrate=(getGlobalMaxVideoBitrate()||"").toString(),h264MaxVideoBitrate=globalMaxVideoBitrate;return h264MaxVideoBitrate&&profile.CodecProfiles[profile.CodecProfiles.length-1].Conditions.push({Condition:"LessThanEqual",Property:"VideoBitrate",Value:h264MaxVideoBitrate,IsRequired:!0}),globalMaxVideoBitrate&&profile.CodecProfiles.push({Type:"Video",Conditions:[{Condition:"LessThanEqual",Property:"VideoBitrate",Value:globalMaxVideoBitrate}]}),browser.chromecast&&profile.CodecProfiles.push({Type:"Audio",Codec:"flac",Conditions:[{Condition:"LessThanEqual",Property:"AudioSampleRate",Value:"48000"}]}),profile.SubtitleProfiles=[],supportsTextTracks()&&profile.SubtitleProfiles.push({Format:"vtt",Method:"External"}),profile.ResponseProfiles=[],profile.ResponseProfiles.push({Type:"Video",Container:"m4v",MimeType:"video/mp4"}),profile}});