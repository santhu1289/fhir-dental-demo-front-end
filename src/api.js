export async function saveCondition(data){

  const response = await fetch("http://localhost:4000/save-condition",{

    method:"POST",

    headers:{
      "Content-Type":"application/json"
    },

    body:JSON.stringify(data)

  });

  return await response.json();

}