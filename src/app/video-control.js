// Simplified video control functionality for Cloudflare Stream iframe
// This script only monitors video events for logging but relies on native controls
window.addEventListener('load', function() {
  console.log('Simple video control script loaded');
  
  // Element reference
  const videoIframe = document.getElementById('videoIframe');
  const videoContainer = document.getElementById('videoContainer');
  
  // Track video state
  let isPlaying = true;

  // Listen for player events from Cloudflare Stream
  window.addEventListener('message', (event) => {
    try {
      const data = event.data;
      
      // Log important events
      if (data.event === 'play' || data.event === 'pause' || data.event === 'ended') {
        console.log('Player event:', data.event);
        
        // Update our tracking of the video state
        if (data.event === 'play') {
          isPlaying = true;
        } else if (data.event === 'pause') {
          isPlaying = false;
        } else if (data.event === 'ended') {
          // Video should automatically restart due to loop=1 parameter
          console.log('Video looping');
        }
      }
    } catch (e) {
      console.error('Error processing player event:', e);
    }
  });
});
