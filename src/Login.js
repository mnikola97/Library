
import React from 'react';
import { InputGroup,FormControl,Text, NavItem } from 'react-bootstrap';

export default class Login extends React.Component {

constructor(props){
        super(props);
        this.state = {
            korisnicko:'',
            lozinka:'',
            greska:'d-none'
        };

    }

updateInfo = (event) =>{
        let fieldName = event.target.name;
        let fieldValue = event.target.value;
        if(fieldName === 'korisnicko') {
            this.setState({korisnicko: fieldValue});
        }
        else if(fieldName === 'lozinka'){
            this.setState({lozinka:fieldValue});
        }
};

prijaviSe=(e)=>{
 let {korisnicko,lozinka}=this.state;
 fetch('http://localhost:3000/login', {
      method: 'post',
      headers: {'Content-Type': 'application/json',"Access-Control-Allow-Headers":"Origin, X-Requested-With, Content-Type, Accept"},
      body: JSON.stringify({
        korisnicko:korisnicko,
        lozinka:lozinka,
      })
    }).then(data=>{
        data.json().then(res=>{
            if(res.uspesno)
            {
                this.setState({
                    greska: 'd-none'
                })
                localStorage.cookie = `token=${res.token}`;
                localStorage.cookie1 = `${res.vlasnik}`;
                if(res.vlasnik===1)
                {
                    
                    this.props.setAdmin(1);
                }
                else{
                    this.props.setAdmin(2);
                }
                this.props.setVisibilityLogin();
            }
            else{
                this.setState({
                    greska: 'd-inline'
                })
            }
        });
})
}

render(){
return(
<div className="flex-column mx-auto mt-5 pt-5 pb-5 ">
    <div className="rounded bg-secondary mx-auto w-50 mt-5 pt-4 pb-4">
<div  className="mx-auto w-75 ">
    <h1 className='rounded bg-primary text-light'>DOBRO DOSLI U BIBLIOTEKU</h1>
    <h5 className='rounded bg-primary text-light mx-auto w-75'>Prijavite se pre korisicenja softvera</h5>
</div>
    <div  className="mx-auto w-75 ">
    <div className={this.state.greska}>
            <label className='my-auto rounded bg-danger text-white p-1 mb-2'>Neispravni podaci za prijavu</label>
        </div>
        <InputGroup className="mb-3" >
            <InputGroup.Text id="basic-addon1">Korisnicko Ime</InputGroup.Text>
            <FormControl
            placeholder="Korisnicko ime"
            aria-describedby="basic-addon1"
            name='korisnicko'
            onChange={this.updateInfo}
            />
        </InputGroup>
    </div>
    <div className="mx-auto w-75" > 
        <InputGroup className="mb-3" onChange={this.updateInfo}>
            <InputGroup.Text id="basic-addon1">Lozinka</InputGroup.Text>
            <FormControl
            placeholder="Lozinka"         
            aria-describedby="basic-addon1"
            onChange={this.updateInfo}
            name='lozinka'
            type='password'
            />
        </InputGroup>
    </div> 
    <button className='btn btn-primary w-75' onClick={this.prijaviSe}>Prijava</button>                                 
    </div>
</div>
)

}
}