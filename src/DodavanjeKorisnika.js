
import { Button } from 'bootstrap';
import React from 'react';
import { InputGroup,FormControl,Text, NavItem, FormLabel } from 'react-bootstrap';
import FormCheckInput from 'react-bootstrap/esm/FormCheckInput';

export default class DodavanjeKorisnika extends React.Component {

constructor(props){
        super(props);
        this.state = {
            vidljivo:this.props.vidljivo,
            korisnicko:'',
            lozinka1:'',
            lozinka2:'',
            greskalozinkaponovo:'d-none',
            checked:false,
            admin:0
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
        if(fieldName === 'korisnicko') {
            this.setState({korisnicko: fieldValue});
        }
        else if(fieldName === 'lozinka1'){
            this.setState({lozinka1:fieldValue});
            if(this.state.lozinka2!==fieldValue)
            {
                this.setState({
                    greskalozinkaponovo: 'd-inline'
                });
            }
        }
        if(fieldName === 'lozinka2'){
            if(this.state.lozinka1!==fieldValue)
            {
                this.setState({
                    lozinka2:fieldValue,
                    greskalozinkaponovo: 'd-inline'
                });
            }
            else{
                    this.setState({lozinka2:fieldValue,greskalozinkaponovo:'d-none'});
                }
        }
        if(fieldName==='admin'){
            fieldValue=event.target.checked;
            this.setState({checked:fieldValue});
        }
};

sacuvajAdmina = (event) =>{
    let text = ""
    if(this.state.lozinka1===this.state.lozinka2){
        if(this.state.korisnicko==='') text+='Korisnicko ime ne sme biti prazno \n';
        if(this.state.korisnicko.length<3) text+='Korisnicko ime mora biti duze od 3 karaktera \n'
        if(this.state.lozinka1.length<3) text+='Lozinka mora biti duze od 3 karaktera \n'

        if(text!=='') alert(text);
        else {
            this.toDatabase();
        }
    }
};

toDatabase = () =>{
    let {korisnicko,lozinka1,admin}=this.state;
 fetch('http://localhost:3000/sacuvajAdmina', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        korisnicko:korisnicko,
        lozinka:lozinka1,
        admin:admin
      })
    }).then(data=>{
        data.json().then(res=>{
            if(res.uspesno)
            {
                alert('Administrator uspesno dodat!');
                this.obrisiSve();
            }
        });
})
};

obrisiSve = () =>{
    this.setState({korisnicko:'',
    lozinka1:'',
    lozinka2:'',
    greskalozinkaponovo:'d-none',
    checked:false,
    admin:0});
};

render(){

return(
<div className={this.state.vidljivo}>
    <div className='mx-auto w-50'>
        <center>
            <h2>Dodavanje novog Admina</h2>
        </center>
        <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Korisnicko Ime</InputGroup.Text>
            <FormControl
            onChange={this.updateInfo}
            name='korisnicko'
            placeholder="Korisnicko ime"
            aria-label="Korisnicko ime"
            aria-describedby="basic-addon1"
            value={this.state.korisnicko}
            />
        </InputGroup>
        <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Lozinka</InputGroup.Text>
            <FormControl
            name='lozinka1'
            placeholder="Lozinka"
            aria-label="Korisnicko ime"
            aria-describedby="basic-addon1"
            onChange={this.updateInfo}
            type='password'
            value={this.state.lozinka1}
            />
        </InputGroup>
        <InputGroup className="mb-1">
            <InputGroup.Text id="basic-addon1">Ponovite lozinku</InputGroup.Text>
            <FormControl
            name='lozinka2'
            placeholder="Ponovite lozinku"
            aria-label="Korisnicko ime"
            aria-describedby="basic-addon1"
            onChange={this.updateInfo}
            type='password'
            value={this.state.lozinka2}
            />
        </InputGroup>
        <div className={this.state.greskalozinkaponovo}>
            <label className='my-auto rounded bg-danger text-white p-1 mb-2'>Lozinke se ne popudaraju</label>
        </div>
        <InputGroup className="mb-3 text rounded">     
    <InputGroup.Checkbox 
    aria-label="Checkbox for following text input" 
    className='rounded' 
    name='admin'
     checked={this.state.checked}
    onClick={this.updateInfo} />
    <label className='m-2 my-auto'>Da li ce novi admin imati sva prava?</label>
  </InputGroup>

  <button className='btn btn-primary w-50' onClick={this.sacuvajAdmina}>Sacuvaj Admina</button>
    </div>
</div>

)

}
}