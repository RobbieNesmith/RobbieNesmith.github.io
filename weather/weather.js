let imagePrefixes = ["MWoverlay_", "20radarOverlay_", "20radarOverlay_s_",
              "surfaceDIV", "surfaceDW", "surfaceFRNT", "surfaceMD",
              "surfaceTE", "surfaceTW"];

class ImageSelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {imagePrefix: null}
  }
  
  render() {
    if (!this.state.imagePrefix) {
      return <section className="holder">
        <h1>Select an image sequence</h1>
        <ul className="imageNameList">
          { this.props.imagePrefixes.map((imgName) => {
            return <li key={ imgName } className="imageName" onClick={ () => { this.setState({imagePrefix: imgName}) } }>{ imgName }</li>;
          }) }
        </ul>
      </section>
    } else {
      return <section className="holder">
        <h1>Viewing { this.state.imagePrefix }</h1>
        <section className="imageHolder">
          <ImageDisplayer url={ `${this.props.urlbase}${this.state.imagePrefix}` }/>
        </section>
        <section className="backHolder" onClick={() => this.setState({imagePrefix: null})}>
          Back
        </section>
      </section>
    }
  }
}

class ImageDisplayer extends React.Component {
    constructor(props) {
    super(props);
    this.state = {image: null};
    console.log(this.props.url);
  }
  
  componentDidMount() {
    let imgs = [];
    let promises = [];

    for (let i = 0; i < 11; i++) {
      promises[i] = fetch(`${this.props.url}${i}.gif`)
        .then(res => res.blob())
        .then(blob => {
          imgs[10 - i] = document.createElement("img");
          imgs[10 - i].src = URL.createObjectURL(blob);
        });
    }

    Promise.all(promises).then( () => {
      var gif = new GIF({
        workers: 2,
        quality: 10,
        debug: true
      });
      console.log(imgs);
      for (let i = 0; i < imgs.length; i++) {
        let img = imgs[i];
        if (img) {
          debug.appendChild(img);
          gif.addFrame(img, {delay:200});
        }
      }

      gif.on('finished', (blob) => {
        this.setState( {img: URL.createObjectURL(blob)});
      });
      gif.render();
    });
  }
  
  render() {
    if (this.state.img) {
      return <img src= { this.state.img } />;
    }
    else {
      return <section className="loading">
        <section>
          <img src="img/loading.gif" />
        </section>
        <section>Loading...</section>
      </section>;
    }
  }
}

ReactDOM.render(<ImageSelector urlbase="http://mesonet.agron.iastate.edu/data/" imagePrefixes={ imagePrefixes } />, document.getElementById("app"));