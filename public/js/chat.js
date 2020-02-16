var socket = io()

//Elements
const $messageForm = document.querySelector('#message-form')
const $messageFormInput = document.querySelector('input')
const $messageFormButton = document.querySelector('button')
const $sendLocationButton = document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $locationMessages = document.querySelector('#locationMessages')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#locationMessage-template').innerHTML

$messageForm.addEventListener('submit', (e) => {
    e.preventDefault()

    $messageFormButton.setAttribute('disabled', 'disabled') 

    const message = e.target.elements.message.value

    socket.emit('sendMessage', message, (error) => {
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if(error) {
            return console.log(error)
        }
        console.log('Message Delivered!')
    })
})

socket.on('message', ({ text, createdAt }) => {
    const html = Mustache.render(messageTemplate, {
        message : text,
        createdAt : moment(createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
})

socket.on('locationMessage', ({ url, createdAt }) => {
        const html = Mustache.render(locationMessageTemplate, {
            url,
            createdAt : moment(createdAt).format('h:mm a')
        })
        $locationMessages.insertAdjacentHTML('beforeend', html)
    })

$sendLocationButton.addEventListener('click', () =>{
    if(!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.')
    }

    $sendLocationButton.setAttribute('disabled', 'disabled')

    navigator.geolocation.getCurrentPosition((position) => {
        console.log(position)
        socket.emit('sendLocation', {
            latitude : position.coords.latitude,
            longitude : position.coords.longitude
        }, () => {
            console.log('Location shared!')
            $sendLocationButton.removeAttribute('disabled')
        })
    })
})