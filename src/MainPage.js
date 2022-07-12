
import React from 'react';
import { InputGroup,FormControl,Text, NavItem } from 'react-bootstrap';
import DodavanjeKnjige from './DodavanjeKnjige';
import DodavanjeKorisnika from './DodavanjeKorisnika';
import ProduzetakClanarine from './ProduzetakClanarine'
import Pozajmice from './Pozajmice'

export default class MainPage extends React.Component {

constructor(props){
        super(props);
        this.state = {
            isAdmin:props.isAdmin===1?'nav-item visible':'nav-item invisible',
            pozajmicaActive:'nav-link active',
            knjigaActive:'',
            korisnikActive:'',
            adminActive:'',
            clanovi:[],
            knjige:[],
            pozajmice:[]
        };
        this.getKnjige();
        this.getKorisnici('');
        this.getPozajmice();
        this.changeView(1);
    }

    componentWillReceiveProps= (nextProps) => {
        this.setState({
          isAdmin: nextProps.isAdmin===1? 'nav-item visible':'nav-item invisible'
        });
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
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        korisnicko:korisnicko,
        lozinka:lozinka,
      })
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

changeView = (event) =>{
    let izabrano=event;
    let stanjeIzabrano = 'nav-link active'
    let stanjeNeIzabrano = 'nav-link'
    switch(izabrano){
        case 1:
        this.setState({pozajmicaActive:stanjeIzabrano,
        knjigaActive:stanjeNeIzabrano,
        korisnikActive:stanjeNeIzabrano,
        adminActive:stanjeNeIzabrano,});
        this.getPozajmice();
        this.getKnjige();
        break;
        case 2:
            this.setState({pozajmicaActive:stanjeNeIzabrano,
                knjigaActive:stanjeNeIzabrano,
                korisnikActive: stanjeIzabrano,
                adminActive:stanjeNeIzabrano});
                this.getKorisnici('');
        break;
        case 3:
            this.setState({pozajmicaActive:stanjeNeIzabrano,
                knjigaActive:stanjeIzabrano,
                korisnikActive:stanjeNeIzabrano,
                adminActive:stanjeNeIzabrano});
            break;
        case 4:
            this.setState({pozajmicaActive:stanjeNeIzabrano,
                knjigaActive:stanjeNeIzabrano,
                korisnikActive:stanjeNeIzabrano,
                adminActive:stanjeIzabrano,});
            break;
    }
}
getKnjige=()=>{
    let {korisnicko,lozinka}=this.state;
    fetch('http://localhost:3000/getKnjige', {
         method: 'post',
         headers: {'Content-Type': 'application/json'}
       }).then(data=>{
           data.json().then(res=>{
               if(res.uspesno)
               {
                   this.setState({knjige:res.knjige});
               }
           });
    });
}
getKorisnici = (text) =>{
    
 let {korisnicko,lozinka}=this.state;
 fetch('http://localhost:3000/getClanovi', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        JMBG:text,
      })
    }).then(data=>{
        data.json().then(res=>{
            if(res.uspesno)
            {
                this.setState({clanovi:res.clanovi});
            }
        });
         //Do anything else like Toast etc.
})
}
getPozajmice = ()=>{
    fetch('http://localhost:3000/getPozajmice', {
        method: 'post',
        headers: {'Content-Type': 'application/json'}
      }).then(data=>{
          data.json().then(res=>{
              if(res.uspesno)
              {
                let dan;
                let mesec;
                let godina;
                let datum;
                let pozajmljeno=res.pozajmice;
                for(let i=0;i<pozajmljeno.length;i++)
                {
                    datum=pozajmljeno[i]['datum_vracanja'].split('T')[0];
                    dan=datum.split('-')[2];
                    mesec = datum.split('-')[1];
                    godina = datum.split('-')[0];
                    pozajmljeno[i].datum = dan+"/"+mesec+"/"+godina;
                }
                  this.setState({pozajmice:pozajmljeno});
              }
          });
  })
}

render(){

return(
<div>
    <div className="navbar navbar-light bg-light p-2">
        <img
            src="https://img.icons8.com/officel/80/000000/book.png"
            height="50"
            className="float-left" />
             
             <img
           src="https://img.icons8.com/external-inkubators-blue-inkubators/50/000000/external-log-out-ecommerce-user-interface-inkubators-blue-inkubators.png"
            height="50"
            className="float-right" 
            onClick={this.props.setLogOff}/>
</div>

<div className="flex-column mx-auto pb-5 px-2">
    <ul className="nav nav-tabs">
    <li className="nav-item"   onClick={()=>{this.changeView(1)}}>
    <a className={"nav-link " + this.state.pozajmicaActive} value='1' >Pozajmice</a>
  </li>
  <li className="nav-item"   onClick={()=>{this.changeView(2)}} >
    <a className={"nav-link " + this.state.korisnikActive} value='2'>Korisnici</a>
  </li>
  <li className="nav-item"  onClick={()=>{this.changeView(3)}}>
    <a className={"nav-link " + this.state.knjigaActive} value='3' >Nova Knjiga</a>
  </li>
  <li className={this.state.isAdmin}  onClick={()=>{this.changeView(4)}}>
    <a className={"nav-link " + this.state.adminActive} value='4'>Novi Admin</a>
  </li>

</ul>
</div>
<DodavanjeKorisnika vidljivo={this.state.adminActive==='nav-link active'?'visible':'d-none invisible'}></DodavanjeKorisnika>
<DodavanjeKnjige vidljivo = {this.state.knjigaActive=== 'nav-link active'?'visible':'d-none invisible'}></DodavanjeKnjige>
<ProduzetakClanarine clanovi={this.state.clanovi} vidljivo = {this.state.korisnikActive=== 'nav-link active'?'visible':'d-none invisible'}></ProduzetakClanarine>
<Pozajmice refresh={this.getPozajmice} clanovi={this.state.clanovi} knjige={this.state.knjige} pozajmice={this.state.pozajmice} vidljivo = {this.state.pozajmicaActive=== 'nav-link active'?'visible':'d-none invisible'} ></Pozajmice>
</div>

)

}
}