import SummaryApi from ".";

export async function login(credentials) {
  const dataResponse = await fetch(SummaryApi.signIn.url, {
    method: "post",
    // credentials: "include",
    headers: {
      "content-type": "application/json",
      // "X-CSRFToken": csrfToken,
    },
    body: JSON.stringify(credentials),
  });
  console.log("data responses", dataResponse);
  const dataApi = await dataResponse.json();

  if (dataApi.success) {
    localStorage.setItem("token", dataApi.access);
    return dataApi.user;
  }

  if (dataApi.error) {
    console.log(dataApi.message);
  }
}
