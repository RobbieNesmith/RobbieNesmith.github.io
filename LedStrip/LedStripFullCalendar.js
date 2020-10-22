function initFullCalendar() {
	var calendarEl = document.getElementById("cal");
	var calendar = new FullCalendar.Calendar(calendarEl, {
		initialView: "timeGridWeek",
		allDaySlot: false,
		headerToolbar: {
      left: '',
      center: '',
      right: ''
		},
		dayHeaderFormat: {
			weekday: "long"
		},
		events: getEventsFromServer,
	});
	calendar.render();
}

function getEventsFromServer(info, successCallback, failureCallback) {
	let fadeEvents = [];
	fetch(`http://${serverName}/fades`)
	.then(r => r.json())
	.then(fades => {
		let today = moment();
		for (let fade_id of Object.keys(fades)) {
			for (let day_of_week of fades[fade_id]["days_of_week"]) {
				let date_for_fade = moment(today).startOf("week").add(day_of_week, "days");
				let start_time = moment(date_for_fade).add(fades[fade_id]["start_time"], "seconds");
				let end_time = moment(date_for_fade).add(fades[fade_id]["end_time"], "seconds");
				fadeEvents.push({
					start: start_time.toDate(),
					end: end_time.toDate()
				});
			}
		}
		successCallback(fadeEvents);
	});
}

