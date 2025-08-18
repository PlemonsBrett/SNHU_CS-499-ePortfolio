<script>
  export let src;
  export let width = "100%";
  export let maxWidth = "800px";
</script>

<video
  controls
  preload="metadata"
  {width}
  style="max-width: {maxWidth}; border-radius: 8px;"
>
  <source {src} type="video/mp4" />
  Your browser doesn't support the video tag
</video>
