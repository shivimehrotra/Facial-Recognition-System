import { useState } from 'react';
import './App.css';

const uuid=require('uuid');

function App() {

  const [image,setImage]=useState('');
  const [uploadResultMessage,setUploadResultMessage]=useState('Please enter an image to authenticate');
  const [visitorName,setVisitorName]=useState('placeholder.jpeg');
  const[isAuth,setAuth]=useState(false);

  function sendImage(e){
    e.preventDefault();
    setVisitorName(image.name);
    const visitorImageName=uuid.v4();
    fetch(`https://2rfyzdrtpi.execute-api.us-east-1.amazonaws.com/dev/shivi-visitor-images/${visitorImageName}.jpeg` ,{
    
    method:'POST',
      headers:{
        'Content-Type':'image/jpeg'
      },
      body:image
    }).then(async()=>{
      const response=await authenticate(visitorImageName);
      if(response.Message==='Success'){
        setAuth(true);
        setUploadResultMessage(`Hi ${response['firstName']} ${response['lastName']},welcome to work.Hope you have a productive day.`)
      }else{
        setAuth(false);
        setUploadResultMessage(`Authentication Failed: This person is not an employee.`)
      }
    }).catch(error=>{
      setAuth(false);
      setUploadResultMessage(`Welcome to work. Hope you have a productive day.`)
      console.error(error);
    })

  }

  async function authenticate(visitorImageName){
    const requestUrl='https://2rfyzdrtpi.execute-api.us-east-1.amazonaws.com/dev/employee?'+new URLSearchParams({
      objectKey:`${visitorImageName}.jpeg`
    });
    return await fetch(requestUrl,{

      method:'GET',
      headers:{
        'Accept':'application/json',
        'Content-Type':'application/json'
      }
    }).then(response=>response().json)
    .then((data)=>{
      return data;
    }).catch(error=>console.error(error));
  }

  return (
    <div className="App">
    <h2>FACIAL RECOGNITION SYSTEM</h2>
    <form onSubmit={sendImage}>
      <input type='file' name='image' onChange={e=> setImage(e.target.files[0])} />
      <button type='submit'>Authenticate</button>
    </form>

    <div className={isAuth? 'success':'failure'}>{uploadResultMessage}</div>
    <img src={require(`./visitors/${visitorName}`)} alt='Visitor' height={250} width={250} />
    </div>
  );
}

export default App;