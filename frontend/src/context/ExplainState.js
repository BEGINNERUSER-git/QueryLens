import ExplainContext from "../context/ExplainContext";




export default function ExplainState({children}) {

    const Explain=async (query)=>{
        try {
      const res = await fetch("http://localhost:5000/query/explain", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "token": sessionStorage.getItem("token: "), 
        },
        body: JSON.stringify({ queryAnalyse: query }),
      });

      const json = await res.json();
      console.log(json);
      return json;
    } catch (error) {
      console.error("Fetch error:", error.message);
    }
    }
  return (
    <div>
      <ExplainContext.Provider
      value={{Explain}}
      >
        {children}

      </ExplainContext.Provider>
    </div>
  )
}
