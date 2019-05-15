'use strict';

/*
 * Modified from img.js and asset_img.js
 */

const url = require('url');
const util = require('hexo-util');
const htmlTag = util.htmlTag;

const rUrl = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[.\!\/\\w]*))?)/; // eslint-disable-line no-useless-escape
const rMeta = /["']?([^"']+)?["']?\s*["']?([^"']+)?["']?/;

const config = hexo.config;
const PostAsset = hexo.model('PostAsset');

function assetSvgTag(args) {
  let asset;
  let item = '';
  let i = 0;
  const len = args.length;

  // Find image URL
  for (; i < len; i++) {
    item = args[i];
    asset = PostAsset.findOne({post: this._id, slug: item});
    if (asset) break;
  }

  if (!asset) return;

  args[i] = url.resolve('/', asset.path);

  return svgTag(args);
};

function makeUrl(path) {
  if (path[0] === '#' || path.substring(0, 2) === '//') {
    return path;
  }

  const data = url.parse(path);

  if (data && data.protocol) {
    return path;
  }

  path = config.root + path;

  return path.replace(/\/{2,}/g, '/');
}

function svgTag(args, content) {
  const classes = [];
  let meta = '';
  let width, height, title, alt, src;
  let item = '';
  let i = 0;
  const len = args.length;

  // Find image URL and class name
  for (; i < len; i++) {
    item = args[i];

    if (rUrl.test(item)) {
      src = makeUrl(item);
      break;
    } else {
      if (item[0] === '/') {
        src = makeUrl(item);
        break;
      } else {
        classes.push(item);
      }
    }
  }

  // Delete image URL and class name from arguments
  args = args.slice(i + 1);

  // Find image width and height
  if (args.length) {
    if (/\d%?/.test(args[0])) {
      width = args.shift();

      if (args.length && /\d%?/.test(args[0])) {
        height = args.shift();
      }
    }

    meta = args.join(' ');
  }

  // Find image title and alt
  if (meta && rMeta.test(meta)) {
    const match = meta.match(rMeta);
    title = match[1];
    alt = match[2];
  }

  const imgAttrs = {
    src,
    class: classes.join(' '),
    width,
    height,
    title,
    alt
  };

  const alternate = htmlTag('img', imgAttrs);
  const type = 'image/svg+xml'
  const data = src

  const svgAttrs = {
    data,
    type,
    class: classes.join(' '),
    width,
    height,
    title,
    alt
  };

  return htmlTag('object', svgAttrs, alternate);
};

/**
 * asset_svg tag
 *
 * Syntax:
 *   {% asset_svg [class names] slug [width] [height] [title text [alt text]]%}
 */
hexo.extend.tag.register('asset_svg', assetSvgTag, false);
hexo.extend.tag.register('svg', svgTag, false);
