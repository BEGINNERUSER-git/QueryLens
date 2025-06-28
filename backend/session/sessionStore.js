const sessionMap=new Map();

const setDBconfig=(userId,config)=>{
   sessionMap.set(userId,config);

}
const getDBconfig=(userId)=>{
  return  sessionMap.get(userId);
    
}
const clearDBconfig=(userId)=>{
    sessionMap.delete(userId);
    
}

export {setDBconfig,getDBconfig,clearDBconfig};