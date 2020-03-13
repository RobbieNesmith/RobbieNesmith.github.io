class MainContainer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {stats: {}};
	}
	componentDidMount() {
		fetch("https://mcplayerstats.herokuapp.com/")
			.then(res => res.json())
			.then(json => this.setState({"stats": json}));
	}
	render() {
		return(
			<div
				className="mainContainer"
			>
				<Header />
				<Sidebar />
				<Content stats={ this.state.stats } />
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

class Content extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		return(
			<div className="content">
				<div>
					{ Object.keys(this.props.stats).length } players detected.
				</div>
				<LeaderboardSelector stats={ this.props.stats } />
			</div>
		);
	}
}

class LeaderboardSelector extends React.Component {
	constructor(props) {
		super(props);

		this.state = {categories: {}, category: undefined, item: undefined };
	}

	componentDidUpdate(prevProps) {
		if (this.props === prevProps) {
			return;
		}
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
				<div>
					<label htmlFor="categorySelect">Select a category</label>
					<select id="categorySelect" onChange={ (e) => this.setState({ category: e.target.value }) }>
						<option value="">Choose a category...</option>
						{ Object.keys(this.state.categories).map(c => {
							return <option value={ c }>{ c }</option>;
						}) }
					</select>
					<label htmlFor="itemSelect">Select an Item</label>
					<select id="itemSelect" onChange={ (e) => this.setState({ item: e.target.value }) }>
						{ items.map(i => {
							return <option value={ i }>{ i }</option>
						}) }
					</select>
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
						{ orderedPlayers.slice(0, 3).map(player =>{
							return <PlayerDisplayer stats={ this.props.stats[player] } key={ player } category={ this.props.category } item={ this.props.item } />;
						}) }
					</div>
					<ol className="leaderboardPlayerList" start="4">
						{ orderedPlayers.slice(3).map((player, i) => {
							return(
								<li className="leaderboardPlayerListItem">
									<span className="playerRank">{ i + 4 }.</span>
									<PlayerDisplayer stats={ this.props.stats[player] } key={ player } category={ this.props.category } item={ this.props.item } />
								</li>
							);
						}) }
					</ol>
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

		return(
			<div className="playerDisplayer">
				<span className="playerName">
					{ this.props.stats["name"] }
				</span>
				<span className="playerScore">
					{ score }
				</span>
			</div>
		);
	}
}

ReactDOM.render(<MainContainer />, document.getElementById("app"));
