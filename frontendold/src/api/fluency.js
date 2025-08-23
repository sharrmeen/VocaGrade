export async function analyzeFluency(audioFile){
    const formData=new FormData();
    formData.append("file",audioFile);
    const response = await fetch("http://localhost:8000/api/analyze-fluency/", {
        method:"POST",
        body: formData,
    });

    if(!response.ok){
        throw new Error("Failed to analyze audio")
    }

    return await response.json();
}