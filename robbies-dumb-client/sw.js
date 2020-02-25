const cacheName = "robbies-dumb-client-cache";

importScripts('https://storage.googleapis.com/workbox-cdn/releases/5.0.0/workbox-sw.js');

if (workbox) {
	console.log("got workbox");
} else {
	console.log("didn't get workbox");
}

workbox.routing.registerRoute(
	/\.js$/,
	new workbox.strategies.NetworkFirst({
		cacheName: cacheName + "-js",
		networkTimeoutSeconds: 5
	})
);

workbox.routing.registerRoute(
	/\.html$/,
	new workbox.strategies.CacheFirst({
		cacheName: cacheName + "-html"
	})
);

workbox.routing.registerRoute(
	/\.css$/,
	new workbox.strategies.StaleWhileRevalidate({
		cacheName: cacheName + "-css"
	})
);

workbox.routing.registerRoute(
	/\.(?:png|jpg|gif)$/,
	new workbox.strategies.CacheFirst({
		cacheName: cacheName + "-images"
	})
);

workbox.routing.registerRoute(
	"https://robbies-dumb-server.herokuapp.com/list",
	new workbox.strategies.StaleWhileRevalidate({
		cacheName: cacheName + "-api"
	}),
	"GET"
);

const showNotification = () => {
	self.registration.showNotification("Background Sync Completed!", {
		body: "POSTs sent to server"
	});
}

const bgSyncPlugin = new workbox.backgroundSync.BackgroundSyncPlugin(
	"dumb-server-queue",
	{
		callbacks: {
			queueDidReplay: showNotification
		}
	}	
);

const networkWithBackgroundSync = new workbox.strategies.NetworkOnly({
	plugins: [bgSyncPlugin]
});

workbox.routing.registerRoute(
	"https://robbies-dumb-server.herokuapp.com/create",
	networkWithBackgroundSync,
	"POST"
);

workbox.precaching.precacheAndRoute([
	{url: "./robbies-dumb-client.html"},
	{url: "./robbies-dumb-client.js"},
	{url: "./robbies-dumb-client.css"},
	{url: "./static.html"},
	{url: "./img/one.jpg"},
	{url: "./img/two.jpg"},
	{url: "./manifest.webmanifest"},
	{url: "./sw.js"}
]);
