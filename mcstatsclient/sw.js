const cacheName = "rcStatsCache";

importScripts("https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js");

if (workbox) {
	console.log("got workbox");
} else {
	console.log("booooo");
}

workbox.routing.registerRoute(
	/\.(?:html|css|js|json|png)$/,
	new workbox.strategies.CacheFirst({
		cacheName: cacheName + "-content"
	})
);

workbox.routing.registerRoute(
	/https:\/\/unpkg.com\/.*\.js/,
	new workbox.strategies.CacheFirst({
		cacheName: cacheName + "-cdnlibs"
	})
);

workbox.routing.registerRoute(
	"https://mcplayerstats.herokuapp.com/",
	new workbox.strategies.NetworkFirst({
		cacheName: cacheName + "-stats",
		networkTimeoutSeconds: 5
	})
);

workbox.routing.registerRoute(
	/https:\/\/crafatar.com\/avatars\/.*\?overlay&size=.* /,
	new workbox.strategies.NetworkFirst({
		cacheName: cacheName + "-playerFaces",
		networkTimeoutSeconds: 5
	})
);

