
export function formDataToJson(formData) {
    var object = {};
    formData.forEach((value, key) => object[key] = value);
    var json = JSON.stringify(object);
    return json;
}