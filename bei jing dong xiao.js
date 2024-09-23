// script.js
document.addEventListener('mousemove', (event) => {
    const { clientX, clientY } = event;
    const width = window.innerWidth;
    const height = window.innerHeight;

    const red = Math.round((clientX / width) * 255);
    const green = Math.round((clientY / height) * 255);
    const blue = Math.round((clientY / height) * 255);

    document.querySelector('.background').style.background = `rgb(${red}, ${green}, ${blue})`;
});

particlesJS('particles-js', {
    particles: {
        number: {
            value: 80,
            density: {
                enable: true,
                value_area: 800
            }
        },
        color: {
            value: '#ffffff'
        },
        shape: {
            type: 'circle',
            stroke: {
                width: 0,
                color: '#000000'
            },
            polygon: {
                nb_sides: 5
            },
        },
        opacity: {
            value: 0.5,
            random: false,
            anim: {
                enable: false,
                speed: 1,
                opacity_min: 0.1,
                sync: false
            }
        },
        size: {
            value: 3,
            random: true,
            anim: {
                enable: false,
                speed: 40,
                size_min: 0.1,
                sync: false
            }
        },
        line_linked: {
            enable: true,
            distance: 150,
            color: '#ffffff',
            opacity: 0.4,
            width: 1
        },
        move: {
            enable: true,
            speed: 6,
            direction: 'none',
            random: false,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200
            }
        }
    },
    interactivity: {
        detect_on: 'canvas',
        events: {
            onhover: {
                enable: true,
                mode: 'repulse'
            },
            onclick: {
                enable: true,
                mode: 'push'
            },
            resize: true
        },
        modes: {
            grab: {
                distance: 400,
                line_linked: {
                    opacity: 1
                }
            },
            bubble: {
                distance: 400,
                size: 40,
                duration: 2,
                opacity: 8,
                speed: 3
            },
            repulse: {
                distance: 200,
                duration: 0.4
            },
            push: {
                particles_nb: 4
            },
            remove: {
                particles_nb: 2
            }
        }
    },
    retina_detect: true
});

/*=============== CLOCK ===============*/
const hour = document.getElementById('clock-hour'),
      minutes = document.getElementById('clock-minutes')

const clock = () =>{
   // We get the Date object
   let date = new Date()

   // We get the hours and minutes 
   // (current time) / 12(hours) * 360(deg circle)
   // (Current minute) / 60(minutes) * 360(deg circle)
   let hh = date.getHours() / 12 * 360,
       mm = date.getMinutes() / 60 * 360

   // We add a rotation to the elements
   hour.style.transform = `rotateZ(${hh + mm / 12}deg)`
   minutes.style.transform = `rotateZ(${mm}deg)`
}
setInterval(clock, 1000) // (Updates every 1s) 1000 = 1s 

/*=============== TIME AND DATE TEXT ===============*/
const dateDayWeek = document.getElementById('date-day-week'),
      dateMonth = document.getElementById('date-month'),
      dateDay = document.getElementById('date-day'),
      dateYear = document.getElementById('date-year'),
      textHour = document.getElementById('text-hour'),
      textMinutes = document.getElementById('text-minutes'),
      textAmPm = document.getElementById('text-ampm')

const clockText = () =>{
   // We get the Date object
   let date = new Date()

   // We get the time and date
   let dayWeek = date.getDay(),
       month = date.getMonth(),
       day = date.getDate(),
       year = date.getFullYear(),
       hh = date.getHours(),
       mm = date.getMinutes(),
       ampm

   // We get the days of the week and the months. (First day of the week Sunday)
   let daysWeek = ['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期天']
   let months = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月']

   // We add the corresponding dates
   dateDayWeek.innerHTML = `${daysWeek[dayWeek]}`
   dateMonth.innerHTML = `${months[month]}`
   dateDay.innerHTML = `${day}, `
   dateYear.innerHTML = year

   // If hours is greater than 12 (afternoon), we subtract -12, so that it starts at 1 (afternoon)
   if(hh >= 12){
      hh = hh - 12
      ampm = 'PM'
   } else{
      ampm = 'AM'
   }

   textAmPm.innerHTML = ampm

   // When it is 0 hours (early morning), we tell it to change to 12 hours
   if(hh == 0){hh = 12}

   // If hours is less than 10, add a 0 (01,02,03...09)
   if(hh < 10){hh = `0${hh}`}

   textHour.innerHTML = `${hh}:`

   // If minutes is less than 10, add a 0 (01,02,03...09)
   if(mm < 10){mm = `0${mm}`}

   textMinutes.innerHTML = mm
}
setInterval(clockText, 1000) // (Updates every 1s) 1000 = 1s

// ai聊天
        // 获取存储的主机地址和系统提示
        let ollama_host = localStorage.getItem("host-address");
        if (!ollama_host) {
            ollama_host = 'http://localhost:11434';
        }

        // 设置主机地址
        function setHostAddress() {
            ollama_host = document.getElementById("host-address").value;
            localStorage.setItem("host-address", ollama_host);
        }

        // 发送消息函数
        async function sendMessage() {
            const userInput = document.getElementById('userInput').value.trim();
            if (userInput === '') return;

            appendMessage(userInput, 'user-message');
            document.getElementById('userInput').value = '';

            const data = {
                model: "openchat",  // 可以根据需要更改模型
                prompt: userInput
            };

            // 清理之前的流式消息容器
            const previousBotMessageContainer = document.querySelector('.bot-message-stream');
            if (previousBotMessageContainer) {
                previousBotMessageContainer.classList.remove('bot-message-stream');
                previousBotMessageContainer.classList.add('bot-message');
            }

            // 创建新的流式消息容器
            const botMessageContainer = document.createElement('div');
            botMessageContainer.className = 'bot-message-stream';
            document.getElementById('chatMessages').appendChild(botMessageContainer);

            try {
                const response = await postRequest(data);
                await getResponse(response, parsedResponse => {
                    appendStreamedMessage(parsedResponse.response, botMessageContainer);
                });
            } catch (error) {
                console.error('Error fetching response:', error);
                appendMessage('Error: Unable to fetch response', 'bot-message');
            }
        }

        // 添加消息到聊天区域
        function appendMessage(message, className) {
            const messageContainer = document.createElement('div');
            messageContainer.className = className; 
            messageContainer.innerHTML = message.replace(/\n/g, '<br>'); // 使用空格替换换行符
            document.getElementById('chatMessages').appendChild(messageContainer);
            document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;
        }

        // 添加流式消息到聊天区域
        function appendStreamedMessage(message, container) {
            container.innerHTML += message.replace(/\n/g, '<br>'); 
            document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight;
        }

        // 发送POST请求到API
        async function postRequest(data) {
            const URL = `${ollama_host}/api/generate`;
            const response = await fetch(URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response;
        }

        // 从服务器流式获取响应
        async function getResponse(response, callback) {
            const reader = response.body.getReader();
            let partialLine = '';

            while (true) {
                const { done, value } = await reader.read();
                if (done) {
                    break;
                }
                // 解码接收到的值并按行分割
                const textChunk = new TextDecoder().decode(value);
                const lines = (partialLine + textChunk).split('\n');
                partialLine = lines.pop(); // 最后一行可能是不完整的

                for (const line of lines) {
                    if (line.trim() === '') continue;
                    const parsedResponse = JSON.parse(line);
                    callback(parsedResponse); // 处理每个响应单词
                }
            }

            // 处理任何剩余的行
            if (partialLine.trim() !== '') {
                const parsedResponse = JSON.parse(partialLine);
                callback(parsedResponse);
            }
        }
        