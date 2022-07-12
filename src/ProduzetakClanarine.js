
import { Button } from 'bootstrap';
import React from 'react';
import { InputGroup,FormControl,Text, NavItem, FormLabel } from 'react-bootstrap';
import FormCheckInput from 'react-bootstrap/esm/FormCheckInput';
import CreatableSelect from 'react-select'

export default class ProduzetakClanarine extends React.Component {

constructor(props){
        super(props);
        this.state = {
            vidljivo:this.props.vidljivo,
            imePrezime:'',
            email:'',
            jmbg:'',
            telefon:'',
            greskajmbg:false,
            greska1:false,
            greska2:false,
            greska3:false,
            clanovi:this.props.clanovi,
            filtriraniClanovi:[],
            izbranEmail:'',
            izabranIstek:'',
            izabranTelefon:'',
            izabranJMBG:''
        };

    }

    componentWillReceiveProps= (nextProps) => {
        this.setState({
            vidljivo: nextProps.vidljivo,
            clanovi:nextProps.clanovi
        });
      }



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
         //Do anything else like Toast etc.
})
};

updateInfo = (event) =>{
    let fieldName = event.target.name;
    let fieldValue = event.target.value;

    if(fieldName === 'imePrezime') {
            this.setState({imePrezime: fieldValue,greskaImePrezime:false});
        }
    if(fieldName === 'email') {
            this.setState({email: fieldValue});

    }
    let reg2 = new RegExp('[^0-9]')
    if(fieldName === 'jmbg') {
        if(reg2.test(fieldValue))
        {
            this.setState({greskaJmbg1: true});
        }
        else{
            this.setState({greskaJmbg1: false,jmbg: fieldValue,greskaJmbg2:false});
        }
    }        
    let reg1 = new RegExp('[^0-9+]')
    if(fieldName === 'telefon'){
        if(reg1.test(fieldValue))
        {
            this.setState({
                greskaTelefon: true,
            });
        }
        else{
                this.setState({telefon:fieldValue,greskaTelefon: false});
            }
    }
};

obrisiSveDodavanjeClana = () =>{
    this.setState({
    imePrezime:'',
    email:'',
    jmbg:'',
    telefon:'',
    greskaJmbg1:false,
    greskaJmbg2:false,
    greskaImePrezime:false,
    greskaTelefon:false,
});
};

sacuvajNovogClana = () =>{
    if(this.state.jmbg.length<1) this.setState({greskaJmbg2:true});
    if(this.state.imePrezime.length<1) this.setState({greskaImePrezime:true});
    else if(this.state.greskaImePrezime && this.state.greskaJmbg2) this.toDatabase();
};

toDatabase = () =>{
    let {imePrezime,telefon,jmbg,email}=this.state;
 fetch('http://localhost:3000/novClan', {
      method: 'post',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        imePrezime:imePrezime,
        telefon:telefon,
        email:email,
        jmbg:jmbg
      })
    }).then(data=>{
        data.json().then(res=>{
            if(res.uspesno)
            {
                alert('Clan uspesno dodat!');
                this.obrisiSveDodavanjeClana();
            }
        });
})
};

addOptions=(e)=>{
    let reg2 = new RegExp('[^0-9]')
    if(e.length>3){
        if(!reg2.test(e))
        {
            let nizClanova1=this.state.clanovi;
            let nizClanovaFiltrirani= [];
            for(let i=0;i<nizClanova1.length;i++)
            {
                if(nizClanova1[i]['JMBG'].includes(e))
                {
                    nizClanovaFiltrirani.push({value:nizClanova1[i]['JMBG'],label:""+nizClanova1[i]['Ime_Prezime']});
                }
            }
            this.setState({ filtriraniClanovi:nizClanovaFiltrirani});           
        }
        else{
            
        }
    }
    else{
        this.setState({ filtriraniClanovi:[]});
    }
}

getSelected=(e)=>{
    let filtrirani=this.state.clanovi
    for(let i=0;i< filtrirani.length;i++)
    {
        if(filtrirani[i]['JMBG']===e.value)
        {
            let datum = filtrirani[i]['Istek_clanarine'].split('T')[0]
            this.setState({
                izbranEmail:filtrirani[i]['email'],
                izabranIstek:datum.split('-')[2]+"/"+datum.split('-')[1]+"/"+datum.split('-')[0],
                izabranTelefon:filtrirani[i]['kontakt_telefon'],
            izabranJMBG:e.value});
        }
    } 
};

ProduziClanarinu=()=>{
    let danasnjiDatum= new Date();
    let clanovi=this.state.clanovi;
    let datumIsteka;
    let datum=new Date();
    let noviDatumIsteka;
    if(this.state.izabranJMBG!=='')
    {   
        for(let i=0;i< clanovi.length;i++)
        {
            if(clanovi[i]['JMBG']===this.state.izabranJMBG)
            {
                datumIsteka= clanovi[i]['Istek_clanarine'].split('T')[0];
                if(datumIsteka<danasnjiDatum.toISOString().split('T')[0])
                {
                    datum= datum.setDate(danasnjiDatum.getDate()+30);
                    this.produzenjeClanarine(datum);
                }
                else{
                    noviDatumIsteka = new Date(datumIsteka.split('-')[0],datumIsteka.split('-')[1]-1,datumIsteka.split('-')[2]);
                    noviDatumIsteka = noviDatumIsteka.setDate(noviDatumIsteka.getDate()+30);
                    this.produzenjeClanarine(noviDatumIsteka);
                }
                
                break;
            }
        }     
    }
    else
    {
        alert("Unesite JMBG clana za produzetak clanarine");
    }
}

produzenjeClanarine=(datum)=>{
    fetch('http://localhost:3000/produziClanarinu', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          jmbg:this.state.izabranJMBG,
          Istek_clanarine:datum
        })
      }).then(data=>{
          data.json().then(res=>{
              if(res.uspesno)
              {
                  alert('Clanarina uspesno produzena!');
                  this.UpdateClanarina(res.novDatum);
              }
        });
        })
}


UpdateClanarina = (noviDatum)=>{
this.setState({
    izabranIstek: noviDatum.split('-')[2]+"/"+noviDatum.split('-')[1]+"/"+noviDatum.split('-')[0]
})
}

render(){

return(
<div className={this.state.vidljivo + ' container-fluid'}>
    <div className='container w-75'>
        <center>
            <h2>Produzetak Clanarine</h2>
        </center>
        <CreatableSelect className='mb-2' placeholder='Unesite JMBG Clana' onInputChange={this.addOptions} onChange={this.getSelected}  menuIsOpen={this.state.filtriraniClanovi.length>0?true:false} options={this.state.filtriraniClanovi}></CreatableSelect>
        <InputGroup className="d-flex justify-content-between mb-3 w-125">
            <div className='d-flex'>
            <InputGroup.Text id="basic-addon1">Email</InputGroup.Text>
            <InputGroup.Text id="basic-addon1">{this.state.izbranEmail}</InputGroup.Text>
            </div>
            <div className='d-flex'>
            <InputGroup.Text id="basic-addon1">Kontakt Telefon</InputGroup.Text>
            <InputGroup.Text id="basic-addon1">{this.state.izabranTelefon}</InputGroup.Text>
            </div>
            <div className='d-flex'>
            <InputGroup.Text id="basic-addon1">Istek Clanarine</InputGroup.Text>
            <InputGroup.Text id="basic-addon1">{this.state.izabranIstek}</InputGroup.Text>
            </div>
        </InputGroup>
        <button className='btn btn-primary w-50' onClick={this.ProduziClanarinu}>Produzi za Mesec</button>
    </div>
    <br></br>
    <br></br>

    <div className='container'>
        <center>
            <h2>Dodavanje novog clana biblioteke</h2>
        </center>
        <InputGroup className="mb-3">
            <InputGroup.Text id="basic-addon1">Ime i Prezime</InputGroup.Text>
            <FormControl
            onChange={this.updateInfo}
            name='imePrezime'
            placeholder="Ime i Prezime"
            aria-label="Korisnicko ime"
            aria-describedby="basic-addon1"
            value={this.state.imePrezime}
            />
        </InputGroup>
        <InputGroup className="mb-3 ml-2">
            <InputGroup.Text id="basic-addon1">Email</InputGroup.Text>
            <FormControl
            name='email'
            placeholder="Email"
            aria-label="Korisnicko ime"
            aria-describedby="basic-addon1"
            onChange={this.updateInfo}           
            value={this.state.email}
            />
            <InputGroup.Text id="basic-addon1">Kontakt Telefon</InputGroup.Text>
            <FormControl
            name='telefon'
            placeholder="Kontakt Telefon"
            aria-label="kolicina"
            aria-describedby="basic-addon1"
            onChange={this.updateInfo}            
            value={this.state.telefon}
            />
        </InputGroup>
        <InputGroup className="mb-1">
            <InputGroup.Text id="basic-addon1">JMBG</InputGroup.Text>
            <FormControl
            name='jmbg'
            placeholder="JMBG"
            aria-label="Korisnicko ime"
            aria-describedby="basic-addon1"
            onChange={this.updateInfo}            
            value={this.state.jmbg}
            />
        </InputGroup>
        

        <button className='btn btn-primary w-50' onClick={this.sacuvajNovogClana}>Dodaj Clana</button>
    </div>
    <div className="vstack mx-auto my-2">
            <div className={this.state.greskaImePrezime?'d-inline':'d-none'}>
                <label className='my-auto rounded bg-danger text-white p-1 mb-2'>Polje Ime i Prezime ne sme biti prazno</label>
            </div>
            <div className={this.state.greskaTelefon?'d-inline':'d-none'}>
                <label className='my-auto rounded bg-danger text-white p-1 mb-2'>Polje Telefon prihvata samo brojeve i znak +</label>
            </div>
            <div className={this.state.greskaJmbg1?'d-inline':'d-none'}>
                <label className='my-auto rounded bg-danger text-white p-1 mb-2'>Polje JMBG mogu biti samo brojevi</label>
            </div>
            <div className={this.state.greskaJmbg2?'d-inline':'d-none'}>
                <label className='my-auto rounded bg-danger text-white p-1 mb-2'>Polje JMBG ne moze biti prazno</label>
            </div>
        </div>
</div>

)

}
}