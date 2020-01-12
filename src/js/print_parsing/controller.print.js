

let page = prepareDocument({
    format: 'A4',
    margin: {
        top: 40,
        left: 20,
        bottom: 15,
        right: 20
    },
    landscape: true,
},[
    {border: {
        x: 0,
        y: 0,
        width: '50%',
        height: '100%',
        stroke: 1,
        corner: 6
    }},
    {border: {
        x: '50%',
        y: 0,
        width: '50%',
        height: '100%',
        stroke: 1,
        corner: 6
    }},
    {text: {
        x: 0,
        y: 5,
        width: '50%',
        height: '100%',
        style: {
            color: '#0057ff',
            align: 'justify',
            size: 30
        },
        text: 'IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII IIIIIII '}}
],{
    page: '3'
})