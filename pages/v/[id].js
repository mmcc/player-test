import 'media-chrome';
import '@mux-elements/mux-video';
import probe from 'probe-image-size';

const IMAGE_BASE_URL = 'https://image.mux.com';

function thumbnailUrl(playbackId) {
  return `${IMAGE_BASE_URL}/${playbackId}/thumbnail.jpg`;
}

function blurHashUrl(playbackId) {
  return `https://blurhash.mux.dev/api/${playbackId}.txt`;
}

function Player(props) {
  return (
    <div className="wrapper">
      <div className="container">
        <media-controller>
          <mux-video
            slot="media"
            height="100px"
            poster={thumbnailUrl(props.playbackId)}
            playbackId={props.playbackId}
          ></mux-video>
          <media-control-bar>
            <media-play-button></media-play-button>
            <media-mute-button></media-mute-button>
            <media-volume-range></media-volume-range>
            <media-time-range></media-time-range>
            <media-pip-button></media-pip-button>
            <media-fullscreen-button></media-fullscreen-button>
          </media-control-bar>
        </media-controller>
      </div>

      <style jsx>{`
        .wrapper {
          width: 100%;
          max-width: 500px;
          margin: 10px auto;
        }

        .container {
          position: relative;
        }

        .container:before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          padding-top: ${(props.height / props.width) * 100}%;
          background-image: url(${props.blurHash});
          background-size: cover;
        }

        media-controller {
          height: 100%;
          width: 100%;
        }
      `}</style>
    </div>
  );
}

export async function getStaticProps(context) {
  const playbackId = context.params.id;
  const imageSize = await probe(thumbnailUrl(playbackId));

  const blurHashRes = await fetch(blurHashUrl(playbackId));
  const blurHash = await blurHashRes.text();

  return {
    props: {
      playbackId,
      blurHash,
      height: imageSize.height,
      width: imageSize.width,
    },
  };
}

export async function getStaticPaths() {
  return { paths: [], fallback: 'blocking' };
}

export default Player;
