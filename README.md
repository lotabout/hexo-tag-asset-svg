## Usage

```
npm install hexo-tag-asset-svg --save
```

And use the `asset_svg` tag for including svg files as native. The syntax is
just like the [img](https://hexo.io/docs/tag-plugins#Image) and
[asset_img](https://hexo.io/docs/tag-plugins#Include-Assets) tag. For example:

```
{% asset_svg [class names] slug [width] [height] [title text [alt text]]%}
```

It will generate the following html tag:

```html
<object type="image/svg+xml" data="/path/to/your/svg" class="native-svg and your own classes">
    <img src="/path/to/your/svg" class="native-svg and your own classes">
</object>
```

Note that if you hope to scale your svgs, make sure your svg include the
`viewbox` attribute.
