import webfont from 'webfontloader';

export default function () {
  webfont.load({
    custom: {
      families: ['cooper_hewittbold', 'cooper_hewittbook', 'cooper_hewittmedium']
    }
  });
}
