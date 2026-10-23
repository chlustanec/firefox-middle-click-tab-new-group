# Middle Click: Tab New Group

Firefox extension. Open a link with the middle mouse button or Ctrl+click
(Cmd+click on macOS) in a tab that is not in a tab group, and the current tab
and the new tab are placed into a newly created tab group. If the current tab
is already in a group, Firefox's default behaviour is kept.

Requires Firefox 140+ (built-in tab groups).

## Development

1. Open `about:debugging#/runtime/this-firefox`.
2. Click "Load Temporary Add-on" and select `manifest.json`.

Set `DEBUG = true` in `background.js` for console logging.

## Packaging

```bash
zip -r ../tab-grouper.zip manifest.json background.js content.js
```

## Privacy

The extension collects no data and makes no network requests.

## License

MIT
