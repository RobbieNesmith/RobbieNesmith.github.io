class MainContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {fetched: false, stats: {}};
	}
	componentDidMount() {
		fetch("https://mcplayerstats.herokuapp.com/")
			.then(res => res.json())
			.then(json => this.setState({"fetched": true, "stats": json}));
	}
	render() {
		return(
			<div className="mainContainer">
				<Header />
				<Sidebar />
				<Content fetched={ this.state.fetched } stats={ this.state.stats } />
			</div>
		);
	}
}

class Header extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return(
			<header className="banner">
				<h1>RaubrieCraft Player Statistics</h1>
			</header>
		);
	}
}

class Sidebar extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return(
			<div className="sidebar">
				<SidebarButton text="Leaderboards" />
				<SidebarButton text="Player Info" />
			</div>
		);
	}
}

class SidebarButton extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return(
			<button className="sidebarButton">{ this.props.text }</button>
		)
	}
}

class SnarkyLoadingMessage extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let messages = ["Fetching server statistics...",
				"Downloading more RAM...",
				"I know how much dirt you have",
				"Awakening the Oracle...",
				"Reading your Tarot...",
				"Getting the deets...",
				"Hang on a sec...",
				"Measuring fun levels...",
				"Acquiring IP with reverse GUI backtracking...",
				"Let me Google that for you",
				];
		let message = messages[Math.floor(Math.random() * messages.length)];
		return <div>{ message }</div>;
	}
}

class Content extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		if (this.props.fetched) {
			return(
				<div className="content">
					<LeaderboardSelector stats={ this.props.stats } />
				</div>
			);
		}

		return(
			<div className="content">
				<SnarkyLoadingMessage />
			</div>
		);
	}
}

class SearchableDropdown extends React.Component {
	constructor(props) {
		super(props);
		this.state = {filter: "", open: false};
	}

	render() {
		let dispText = this.props.value;
		if (!this.props.value) {
			dispText = this.props.selectionMessage;
		}

		let unfocusCatcher = null;
		let dropdownMenu = null;
		let searchbarClass = "dropdownSearcher";
		if (this.state.open) {
			unfocusCatcher = <div className="unfocusCatcher" onClick={ () => this.setState({open: false}) }></div>;
			dispText = this.state.filter;
			dropdownMenu = <ul className="dropdownList">
				{ this.props.options.filter(op => op.toLowerCase().includes(this.state.filter.toLowerCase())).map(option => <li onClick={ () => this.setState({option, open: false}, this.props.onChange(option)) }>{ option }</li>) }
			</ul>;
			searchbarClass = "dropdownSearcher dropdownSearcherActive";
		}
		return (
			<div className="searchableDropdown">
				{ unfocusCatcher }
				<input
					placeholder="Filter..."
					className={ searchbarClass }
					value={ dispText }
					onClick={ () => {
						if (!this.state.open) {
							this.setState({open: true, filter: ""});
						}
					} }
					onChange={ (evt) => this.setState({filter: evt.target.value}) }
				/>
				{ dropdownMenu }
			</div>
		);
	}
}

class LeaderboardSelector extends React.Component {
	constructor(props) {
		super(props);

		this.state = {categories: {}, category: "", item: "" };
	}

	componentDidMount() {
		let categories = {};

		for (let p of Object.keys(this.props.stats)) {
			let playerCategories = Object.keys(this.props.stats[p]["stats"]);
			for (let c of playerCategories) {
				if (!(c in categories)) {
					categories[c] = [];
				}
				for (let i of Object.keys(this.props.stats[p]["stats"][c])) {
					if (!categories[c].includes(i)) {
						categories[c].push(i);
					}
				}
			}
		}
		this.setState({categories: categories});
	}

	render() {
		let items = [];
		if (this.state.category) {
			items = this.state.categories[this.state.category];
		}
		return (
			<div>
				<div className="selections">
					<span>Select a Category: </span>
					<SearchableDropdown selectionMessage="Select a Category" value={ this.state.category } onChange={ (c) => this.setState({category: c, item: ""}) } options={ Object.keys(this.state.categories) } />
					<span>Select an Item: </span>
					<SearchableDropdown selectionMessage="Select an Item" value={ this.state.item } onChange={ (i) => this.setState({item: i}) } options={ items } />
				</div>
				<div>
					<Leaderboard stats={ this.props.stats } category={ this.state.category } item={ this.state.item } />
				</div>
			</div>
		);
	}
}

function sortByCategoryItem(a, b, stats, category, item) {
	let ac = stats[a]["stats"][category];
	let av = 0;
	if (ac) {
		av = stats[a]["stats"][category][item];
		if (!av) {
			av = 0;
		}
	}
	let bc = stats[b]["stats"][category];
	let bv = 0
	if (bc) {
		bv = stats[b]["stats"][category][item];
		if (!bv) {
			bv = 0;
		}
	}
	return av - bv;
}

class Leaderboard extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		if (!this.props.category || !this.props.item) {
			return <div>Select a category and item to sort</div>;
		}
		let orderedPlayers = Object.keys(this.props.stats).sort((a,b) => sortByCategoryItem(b, a, this.props.stats, this.props.category, this.props.item));
		return(
			<div>
				<header>
					<h2>leaderboard for { `${this.props.category} ${this.props.item}` }</h2>
				</header>
				<section>
					<div className="topThree">
						{ orderedPlayers.slice(0, 3).map((player, i) =>{
							return <PlayerDisplayer stats={ this.props.stats[player] } uuid={ player } key={ player } category={ this.props.category } item={ this.props.item } rank={ i } podium={ true } />;
						}) }
					</div>
					<div className="leaderboardPlayerListContainer">
						<table className="leaderboardPlayerList">
							<tbody>
								{ orderedPlayers.map((player, i) => {
									return <PlayerDisplayer stats={ this.props.stats[player] } uuid={ player } category={ this.props.category } item={ this.props.item } rank={ i } />;
								}) }
							</tbody>
						</table>
					</div>
				</section>
			</div>
		);
	}
}

class PlayerDisplayer extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let score = 0;
		if (this.props.stats["stats"][this.props.category] && this.props.stats["stats"][this.props.category][this.props.item]) {
			score = this.props.stats["stats"][this.props.category][this.props.item];
		}
		let imgSize = 32;
		let ContainerTag = "tr";
		let ChildTag = "td";
		let rank = <td className="playerRank">{ this.props.rank + 1 }.</td>;
		if (this.props.rank < 3 && this.props.podium) {
			imgSize = 64;
			ContainerTag = "div";
			ChildTag = "span";
			rank = null;
		}
		if (this.props.rank === 0 && this.props.podium) {
			imgSize = 128;
		}

		return(
			<ContainerTag className="playerDisplayer">
				{ rank }
				<ChildTag className="playerFaceContainer">
					<a href={ `https://namemc.com/profile/${this.props.uuid}` }>
						<img className="playerFace" src={ `https://crafatar.com/avatars/${this.props.uuid}?overlay&size=${imgSize}` } />
						<img className="hidden" src={ `https://crafatar.com/avatars/${this.props.uuid}?overlay&size=${32}` } />
						<img className="hidden" src={ `https://crafatar.com/avatars/${this.props.uuid}?overlay&size=${64}` } />
						<img className="hidden" src={ `https://crafatar.com/avatars/${this.props.uuid}?overlay&size=${128}` } />
					</a>
				</ChildTag>
				<ChildTag className="playerName">
					{ this.props.stats["name"] }
				</ChildTag>
				<ChildTag className="playerScore">
					{ score }
				</ChildTag>
			</ContainerTag>
		);
	}
}

ReactDOM.render(<MainContainer />, document.getElementById("app"));
