const testButton = document.getElementById("testButton");

testButton.addEventListener("click", testBackend);

async function testBackend() {
    const response = await fetch(
        "http://localhost:8080/api/hello"
    );

    const data = await response.json();

    document.getElementById("testResponse").textContent = 
        data.testMessage;
}