const calendarResizeBreakpoint = 765;

function initFullCalendar() {
	let weekdayFormat = "long";
	if (window.innerWidth < calendarResizeBreakpoint) {
		weekdayFormat = "short";
	}
	var calendarEl = document.getElementById("cal");
	var calendar = new FullCalendar.Calendar(calendarEl, {
		initialView: "timeGridWeek",
		nowIndicator: true,
		expandRows: true,
		allDaySlot: false,
		slotDuration: "01:00:00",
		height: "100%",
        eventDidMount: function(arg) {
            arg.el.style.background = arg.event.extendedProps.gradientString;
        },
		headerToolbar: {
      left: '',
      center: '',
      right: ''
		},
		dayHeaderFormat: {
			weekday: weekdayFormat
		},
		events: getEventsFromServer,
		windowResize: function(view) {
			if (window.innerWidth < calendarResizeBreakpoint) {
				calendar.setOption("dayHeaderFormat", {weekday: "short"});
			} else {
				calendar.setOption("dayHeaderFormat", {weekday: "long"});
			}
		}
	});
	calendar.render();
}

async function getEventsFromServer(info, successCallback, failureCallback) {
	let fadeEvents = [];
	let fadesResponse = await fetch(`http://${serverName}/fades`);
    let fades = await fadesResponse.json();

    let today = moment();
    for (let fade_id of Object.keys(fades)) {
        let fadeStopsResponse = await fetch(`http://${serverName}/fades?id=${fade_id}`);
        let fadeStops = await fadeStopsResponse.json();
        let fadeDuration = fades[fade_id]["end_time"] - fades[fade_id]["start_time"];
        let gradientString = "linear-gradient(";
        let gradientStops = [];
        let timeIntoFade = 0;
        for (let stop of fadeStops["stops"]) {
            gradientStops.push(`rgb(${stop.r},${stop.g},${stop.b}) ${Math.floor(timeIntoFade * 100 * fadeStops["millis_per_tick"] / 1000)}%`);
            timeIntoFade += stop.t / fadeDuration;
        }
        gradientString += gradientStops.join(",");
        gradientString += ")";
        for (let day_of_week of fades[fade_id]["days_of_week"]) {
            let date_for_fade = moment(today).startOf("week").add(day_of_week, "days");
            let start_time = moment(date_for_fade).add(fades[fade_id]["start_time"], "seconds");
            let end_time = moment(date_for_fade).add(fades[fade_id]["end_time"], "seconds");
            fadeEvents.push({
                start: start_time.toDate(),
                end: end_time.toDate(),
                extendedProps: {
                    gradientString: gradientString
                }
            });
        }
    }
	successCallback(fadeEvents);
}

