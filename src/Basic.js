import React, {Component} from 'react';
import Dropzone from 'react-dropzone';
import * as XLSX from "xlsx";

export default class Basic extends Component {
  constructor() {
    super();
    this.onDrop = (files) => {
      this.setState({files})
      this.readFile();
    };
    this.state = {
      files: [],
      jsonLoaded:''
    };
  }

  readFile() {
    var me=this;
    var f = this.state.files[0];
    var name = f.name;
    const reader = new FileReader();
    reader.onload = (evt) => {
      // evt = on_file_select event
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      /* Update state */
      console.log("Data>>>" + data);// shows that excel data is read
      console.log(this.convertToJson(data)); // shows data in json format
      this.setState({jsonLoaded:this.convertToJson(data)});
      this.sendRequest();
    };
    reader.readAsBinaryString(f);
  }

  sendRequest(){
    fetch('http://localhost:3000/excelKnjige', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: this.state.jsonLoaded
    }).then(data=>{
        data.json().then(res=>{
            if(res.uspesno)
            {
                if(res.vlasnik===1)
                {
                    this.props.setVisibilityLogin();
                }
                else{

                }
            }
        });
         //Do anything else like Toast etc.
})
  }

  convertToJson(csv) {
    var lines = csv.split("\n");

    var result = [];

    var headers = lines[0].split(",");

    for (var i = 1; i < lines.length; i++) {
      var obj = {};
      var currentline = lines[i].split(",");

      for (var j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }

      result.push(obj);
    }

    //return result; //JavaScript object
    return JSON.stringify(result); //JSON
  }


  render() {
    const files = this.state.files.map(file => (
      <center key={file.name}>
        {file.name}
      </center>
    ));

    return (
      <Dropzone onDrop={this.onDrop}>
        {({getRootProps, getInputProps}) => (
          <section className="container">
            <div {...getRootProps({className: 'dropzone'})}>
              <input {...getInputProps()} />
              <p>Prevuci fajl, ili klikni ovde</p>
            </div>
            <aside>
              <center>{files}</center>
            </aside>
          </section>
        )}
      </Dropzone>
    );
  }
}