
import { Button } from 'bootstrap';
import React from 'react';
import { InputGroup,FormControl,Text, NavItem, FormLabel } from 'react-bootstrap';
import FormCheckInput from 'react-bootstrap/esm/FormCheckInput';
import CreatableSelect from 'react-select'
import DataGrid from 'react-data-grid';

export default class Pozajmice extends React.Component {
constructor(props){
        super(props);
        let novePozajmice = this.props.pozajmice;
        let dan;
        let mesec;
        let godina;
        let datum;
        for(let i=0;i<novePozajmice.length;i++)
          {
              datum=novePozajmice[i]['datum_vracanja'].split('T')[0];
              dan=datum.split('-')[2];
              mesec = datum.split('-')[1];
              godina = datum.split('-')[0]
              novePozajmice[i]['datum'] = dan+"/"+mesec+"/"+godina;
          }
        this.state = {
            vidljivo:this.props.vidljivo,
            dostupneKnjige:this.props.knjige,
            clanovi:this.props.clanovi,
            NizClanovi:[],
            NizKnjiga:[],
            izabraniIDKnjige:'',
            izabraniJMBG:'',
            pozajmice:novePozajmice,
            redovi:[],
            refresh:this.props.refresh
        };
        this.FormirajOpcije();
        this.napraviRedove();
    }

    componentDidMount(){
        this.napraviRedove();
    }

    componentWillReceiveProps= (nextProps) => {
        this.setState({
            vidljivo: nextProps.vidljivo,
            dostupneKnjige:nextProps.knjige,
            clanovi:nextProps.clanovi,
            pozajmice:nextProps.pozajmice
        });
        this.FormirajOpcije();
        this.napraviRedove();
      }

      FormirajOpcije=()=>{
          let clanovi = this.state.clanovi;
          let knjige = this.state.dostupneKnjige;
          let opcijeClanovi=[];
          let opcijeKnjige=[];
          for(let i=0;i<clanovi.length;i++)
          {
            opcijeClanovi.push({value:clanovi[i]['JMBG'],label:""+clanovi[i]['Ime_Prezime']})
          }
          for(let i=0;i<knjige.length;i++)
          {
            opcijeKnjige.push({value:knjige[i]['Id'],label:""+knjige[i]['Naziv']})
          }

          this.setState({NizClanovi:opcijeClanovi,NizKnjiga:opcijeKnjige});
      }

    napraviRedove=()=>{
          let pozajmice=this.state.pozajmice;
          let redovi1=[];
          let dan;
          let mesec;
          let godina;
          let datum;
          for(let i=0;i<pozajmice.length;i++)
          {
              datum=pozajmice[i]['datum_vracanja'].split('T')[0];
              dan=datum.split('-')[2];
              mesec = datum.split('-')[1];
              godina = datum.split('-')[0]
              redovi1.push({naziv:pozajmice[i]['Naziv'],
              jmbg:pozajmice[i]['jmbg_korisnika'],
              datum:dan+"/"+mesec+"/"+godina});
          }
        this.setState({redovi:redovi1})
    }

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
            this.setState({ NizClanovi:nizClanovaFiltrirani});           
        }
        else{
            
        }
    }
    else{
        this.setState({ NizClanovi:[]});
    }
}
getSelectedClan=(e)=>{
    this.setState({izabraniJMBG:e.value});
}

getSelectedKnjiga=(e)=>{
    this.setState({izabraniIDKnjige:e.value});
}

napraviPojazmicu=()=>{
    if(this.state.izabraniJMBG!=='' && this.state.izabraniIDKnjige!==''){
    fetch('http://localhost:3000/napraviPozajmicu', {
        method: 'post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          jmbg:this.state.izabraniJMBG,
          id_knjige:this.state.izabraniIDKnjige
        })
      }).then(data=>{
          data.json().then(res=>{
              if(res.uspesno)
              {
                  alert('Pozajmica uspesno kreirana!');
              }
        });
        })
    }
    else {
        alert('Izaberite i knjigu i korisnika.');
    }
}

RowClicked=(e)=>{
    if(window.confirm("Da li je knjiga " + e.Naziv + " vracena?")===true)
    {
        this.izbrisiPozajmicu(e);
    }
}


izbrisiPozajmicu=(pozajmica)=>{
   
        fetch('http://localhost:3000/obrisiPozajmicu', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id:pozajmica.id,
            })
          }).then(data=>{
              data.json().then(res=>{
                  if(res.uspesno)
                  {
                      alert('Pozajmica uspesno zavrsena!');
                      this.state.refresh();
                  }
            });
            })

}
render(){
return(
<div className={this.state.vidljivo}>
    <div className='mx-auto w-50'>
        <center>
            <h2>Nova Pozajmica</h2>
        </center>
        <div className='d-flex'>
            <CreatableSelect className='mx-2 w-50' onChange={this.getSelectedClan}  placeholder='Unesite JMBG Clana' onInputChange={this.addOptions} options={this.state.NizClanovi}></CreatableSelect>
            <CreatableSelect className='mx-2 w-50' onChange={this.getSelectedKnjiga} placeholder='Unesite Naziv Knjige' options={this.state.NizKnjiga} ></CreatableSelect>
        </div>
  <button className='btn btn-primary w-50 my-2' onClick={this.napraviPojazmicu}>Potvrdi Pozajmicu</button>

  <h2>Pozajmljene Knjige</h2>

<DataGrid columns={[
  { key: 'Naziv', name: 'Naziv'},
  { key: 'jmbg_korisnika', name: 'JMBG Clana'},
  { key: 'datum', name: 'Rok za Vracanje'}
]}
  rows={this.state.pozajmice} onRowClick={this.RowClicked}></DataGrid>
    </div>
</div>

)

}
}