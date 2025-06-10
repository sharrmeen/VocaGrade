export async function analyzeFluency(audioFile){
    const formData=new formData();
    formData.append("file",audioFile);
    const response = await fetch("/api/analyze-fluency/",{
        method:"POST",
        body: formData,
    });

    if(!response.ok){
        throw new Error("Failed to analyze audio")
    }

    return await response.json();
}