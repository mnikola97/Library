
import { Button } from 'bootstrap';
import React from 'react';
import { InputGroup,FormControl,Text, NavItem, FormLabel } from 'react-bootstrap';
import {useDropzone} from 'react-dropzone';
import FormCheckInput from 'react-bootstrap/esm/FormCheckInput';
import Basic from './Basic';

const excelToJson = require('convert-excel-to-json');


export default class DodavanjeKnjige extends React.Component {


    

constructor(props){
        super(props);
        this.state = {
            vidljivo:this.props.vidljivo,
            naziv:'',
            autor:'',
            kolicina:'',
            izdavac:'',
            greskaKolicina:false,
            greska1:false,
            greska2:false,
            greska3:false,
        };
    }

    componentWillReceiveProps= (nextProps) => {
        this.setState({
            vidljivo: nextProps.vidljivo
        });
      }

      updateInfo = (event) =>{
        let fieldName = event.target.name;
        let fieldValue = event.target.value;

        if(fieldName === 'naziv') {
            if(fieldValue.length<1)
            {
                this.setState({greska3: true, naziv: fieldValue});
            }
            else{
                this.setState({greska3: false,naziv: fieldValue});
            }
        }
        if(fieldName === 'autor') {
            if(fieldValue.length<1)
            {
                this.setState({greska1: true,autor: fieldValue});

            }
            else{
                this.setState({greska1: false,autor: fieldValue});
            }
        }
        if(fieldName === 'izdavac') {
            if(fieldValue.length<1)
            {
                this.setState({greska2: true,izdavac: fieldValue});

            }
            else{
                this.setState({greska2: false,izdavac: fieldValue});
            }
        }        
        if(fieldName === 'kolicina'){
            if(parseInt(fieldValue)<1 || isNaN(parseInt(fieldValue)))
            {
                this.setState({
                    greskaKolicina: true,
                    kolicina:parseInt(fieldValue)
                });
            }
            else{
                    this.setState({kolicina:parseInt(fieldValue),greskaKolicina:false});
                }
        }
};

sacuvajAdmina = (event) =>{
    if(!this.state.greska1 && !this.state.greska2 && !this.state.greska3 ){   
        if(this.state.naziv==='')
        {
            this.setState({greska3:true});
        }
        if(this.state.izdavac==='')
        {
            this.setState({greska2:true});
        }
        if(this.state.autor==='')
        {
            this.setState({greska1:true});
        }
        if(this.state.kolicina==='')
        {
            this.setState({greskaKolicina:true});
        } 
        if(!this.state.greska1 && !this.state.greska2 && !this.state.greska3 && !this.state.greskaKolicina)
        this.toDatabase();
    }
};


toDatabase = () =>{
    let {naziv,kolicina,izdavac,autor}=this.state;
 fetch('http://localhost:3000/sacuvajKnjigu', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        naziv:naziv,
        kolicina:kolicina,
        izdavac:izdavac,
        autor:autor
      })
    }).then(data=>{
        data.json().then(res=>{
            if(res.uspesno)
            {
                alert('Knjiga uspesno dodata!');
                this.obrisiSve();
            }
        });
})
};

obrisiSve = () =>{
    this.setState({
    naziv:'',
    autor:'',
    kolicina:'',
    izdavac:'',
    greskaKolicina:false,
    greska1:false,
    greska2:false,
    greska3:false
});
};

render(){

return(
<div className={this.state.vidljivo}>
    <div className='mx-auto w-50'>
        <center>
            <h2>Dodavanje nove knjige</h2>
        </center>
        <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Naziv Knjige</InputGroup.Text>
            <FormControl
            onChange={this.updateInfo}
            name='naziv'
            placeholder="Naziv Knjige"
            aria-label="Korisnicko ime"
            aria-describedby="basic-addon1"
            value={this.state.naziv}
            />
        </InputGroup>
        <InputGroup className="mb-3 ml-2">
            <InputGroup.Text id="basic-addon1">Izdavac</InputGroup.Text>
            <FormControl
            name='izdavac'
            placeholder="Izdavac"
            aria-label="Korisnicko ime"
            aria-describedby="basic-addon1"
            onChange={this.updateInfo}           
            value={this.state.izdavac}
            />
            <InputGroup.Text id="basic-addon1">Kolicina</InputGroup.Text>
            <FormControl
            name='kolicina'
            placeholder="Kolicina"
            aria-label="kolicina"
            type="number"
            aria-describedby="basic-addon1"
            onChange={this.updateInfo}            
            value={this.state.kolicina}
            />
        </InputGroup>
        <InputGroup className="mb-1">
            <InputGroup.Text id="basic-addon1">Autor</InputGroup.Text>
            <FormControl
            name='autor'
            placeholder="Autor"
            aria-label="Korisnicko ime"
            aria-describedby="basic-addon1"
            onChange={this.updateInfo}            
            value={this.state.autor}
            />
        </InputGroup>
        <div className="vstack mx-auto my-2">
            <div className={this.state.greskaKolicina?'d-inline':'d-none'}>
                <label className='my-auto rounded bg-danger text-white p-1 mb-2'>Minimalna kolicina je 1</label>
            </div>
            <div className={this.state.greska1?'d-inline':'d-none'}>
                <label className='my-auto rounded bg-danger text-white p-1 mb-2'>Polje Autor ne moze biti prazno</label>
            </div>
            <div className={this.state.greska2?'d-inline':'d-none'}>
                <label className='my-auto rounded bg-danger text-white p-1 mb-2'>Polje Izdavac ne moze biti prazno</label>
            </div>
            <div className={this.state.greska3?'d-inline':'d-none'}>
                <label className='my-auto rounded bg-danger text-white p-1 mb-2'>Polje Naziv ne moze biti prazno</label>
            </div>
        </div>
        

  <button className='btn btn-primary w-50' onClick={this.sacuvajAdmina}>Sacuvaj Knjigu</button>



    </div>

    
<br></br>
<br></br>
    <div>
    <center className='container'>
        <h2>Dodavanje knjiga iz excel fajla</h2>
    </center>

<div className='mx-auto my-5 w-25 bg-secondary rounded'>
    <Basic></Basic>
</div>
</div>


</div>

)

}
}