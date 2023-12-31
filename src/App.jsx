import { useEffect, useRef, useState } from "react";
import "./App.css";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import {
  MainContainer,
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import robo from "./robo.png";
import ggdimg from "./ggd.png";
import "bootstrap/dist/css/bootstrap.css";
import ai from "./ai.png";
import cc from "./cc.jpg";
import pp from "./pp.png";
import pf from "./pf.png";
import cam from "./cam.png";
import w from "./w.png";
import { useSpeechSynthesis } from "react-speech-kit";

const API_KEY = process.env.REACT_APP_API_KEYY;
console.log(API_KEY);

function App() {
  const [typing, setTyping] = useState(false);
  const [text, setText] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [cm,setCm] = useState(true);
  const videoRef = useRef(null);
  const photoRef = useRef();

  useEffect(() => {
  navigator.mediaDevices
      .getUserMedia({
        video: { width: 1500, height: 1000 },
      })
      .then((stream) => {
        let video = videoRef.current;
        video.srcObject = stream;
        video.play();
      });
  }, [videoRef,cm]);




  const { speak } = useSpeechSynthesis();
  let synth = window.speechSynthesis;

  const [messages, setMessages] = useState([
    {
      message: "Hi, How Can I help you ?",
      sender: "ChatGPT",
    },
  ]);

  const handleSend = async (message) => {
    setText('')
    const newMessage = {
      message: message,
      sender: "user",
      direction: "outgoing",
    };

    const newMessages = [...messages, newMessage];

    setMessages(newMessages);

    setTyping(true);

    await processMessageToChatGPT(newMessages);
  };

  async function processMessageToChatGPT(chatMessages) {
    let apiMessages = chatMessages.map((messageObject) => {
      let role = "";
      if (messageObject.sender === "ChatGPT") {
        role = "assistant";
      } else {
        role = "user";
      }
      return { role: role, content: messageObject.message };
    });

    const systemMessage = {
      role: "system",
      content: "Explain all concepts like I am 10 years old.",
    };

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [systemMessage, ...apiMessages],
    };

    await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    })
      .then((data) => {
        return data.json();
      })
      .then((data) => {
        setText(data.choices[0].message.content);
      
        setMessages([
          ...chatMessages,
          {
            message: data.choices[0].message.content,
            sender: "ChatGPT",
          },
        ]);
        setTyping(false);
      });
  }

  useEffect(() => {
    speak({text:text})
  },[text]);

  return (
    <div class="App">
      <div className="headerd"><svg
        width="270"
        height="58"
        viewBox="0 0 240 58"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
  
        <path
          d="M0.49763 44.8762C0.398104 45.4733 0.298578 46.3691 0.796208 47.7624C2.38862 52.042 7.46445 54.5302 8.55923 55.0278C12.7393 57.0183 16.5213 57.1179 18.2133 57.1179C19.0095 57.1179 22.1943 57.1179 26.1753 55.824C27.6682 55.3264 29.8578 54.6297 32.1469 52.9378C34.3365 51.3454 35.2322 49.8525 35.5308 49.4544C35.5308 49.4544 35.5308 49.4544 35.5308 49.3548C35.8293 48.8572 36.8246 47.2648 36.526 45.2743C36.526 44.9757 36.1279 43.0847 34.5355 41.8904C34.5355 41.8904 31.8483 40.0989 28.8625 41.6913C28.763 41.6913 28.6635 41.7909 28.6635 41.7909C28.4644 41.9899 28.2654 42.0895 28.2654 42.0895C27.9668 42.388 26.872 43.3833 26.7725 43.4828C26.7725 43.4828 26.0758 44.08 24.2843 45.2743C24.0853 45.3738 23.8862 45.5729 23.8862 45.5729L23.7867 45.6724C23.2891 45.971 22.2938 46.4686 21.0995 46.7672C20.2038 46.9662 18.3128 47.5634 15.9242 46.9662C13.9336 46.5681 12.5403 45.5729 11.9431 45.1748C11.0474 44.5776 10.9479 44.279 8.95734 42.6866C7.46445 41.4923 7.16587 41.2932 6.66824 41.1937C4.87677 40.5966 3.18483 41.4923 2.98578 41.6913C2.78673 41.5918 0.895734 42.6866 0.49763 44.8762Z"
          fill="white"
        />
        <path
          d="M35.5308 18.998C35.5308 14.2208 35.6303 9.34399 35.6303 4.56675C35.5308 4.16864 35.3317 3.67101 34.8341 3.07386C34.5355 2.57623 33.7393 1.58097 32.3459 1.08334C32.0474 0.98381 30.9526 0.685232 29.7583 1.08334C28.1658 1.58097 27.4692 2.97433 27.2701 3.27291C26.9715 3.77054 26.872 4.26817 26.872 4.56675C26.872 4.7658 26.872 4.96485 26.872 5.1639C24.1848 3.57149 21.0995 2.57623 17.7156 2.57623C7.96208 2.67575 0 10.6378 0 20.4909C0 30.344 7.96208 38.2065 17.7156 38.2065C27.4692 38.2065 35.4312 30.2444 35.4312 20.4909C35.5308 19.9933 35.4312 19.4956 35.5308 18.998ZM17.7156 28.453C13.237 28.453 9.75355 24.87 9.75355 20.3914C9.75355 15.9127 13.3365 12.3298 17.8151 12.3298C22.2938 12.3298 25.8768 15.9127 25.8768 20.3914C25.8768 24.87 22.1943 28.453 17.7156 28.453Z"
          fill="white"
        />
        <path
          d="M62.4887 16.7637C63.9615 16.7637 65.2561 17.0607 66.3726 17.6545C67.489 18.2247 68.368 18.9729 69.0093 19.8994V17.0844H74.0335V36.9672C74.0335 38.7963 73.6653 40.4235 72.9289 41.8488C72.1925 43.2978 71.0879 44.438 69.6151 45.2694C68.1423 46.1246 66.3607 46.5522 64.2703 46.5522C61.4672 46.5522 59.163 45.8989 57.3576 44.5924C55.576 43.2859 54.5665 41.5043 54.3289 39.2476H59.2818C59.5431 40.1503 60.1013 40.8629 60.9565 41.3855C61.8354 41.9319 62.8925 42.2051 64.1278 42.2051C65.5768 42.2051 66.7526 41.7656 67.6553 40.8867C68.558 40.0315 69.0093 38.725 69.0093 36.9672V33.9028C68.368 34.8292 67.4772 35.6013 66.3369 36.2189C65.2205 36.8365 63.9377 37.1453 62.4887 37.1453C60.8258 37.1453 59.3055 36.7177 57.9278 35.8626C56.55 35.0074 55.4573 33.8078 54.6496 32.2637C53.8657 30.6959 53.4737 28.9024 53.4737 26.8833C53.4737 24.8879 53.8657 23.1181 54.6496 21.5741C55.4573 20.03 56.5381 18.8423 57.8921 18.0109C59.2699 17.1795 60.8021 16.7637 62.4887 16.7637ZM69.0093 26.9545C69.0093 25.743 68.7718 24.7097 68.2967 23.8545C67.8216 22.9756 67.1802 22.3105 66.3726 21.8591C65.5649 21.384 64.6979 21.1465 63.7714 21.1465C62.845 21.1465 61.9898 21.3722 61.2059 21.8235C60.422 22.2748 59.7806 22.94 59.2818 23.8189C58.8067 24.6741 58.5691 25.6955 58.5691 26.8833C58.5691 28.071 58.8067 29.1162 59.2818 30.0189C59.7806 30.8978 60.422 31.5748 61.2059 32.0499C62.0136 32.525 62.8688 32.7626 63.7714 32.7626C64.6979 32.7626 65.5649 32.5369 66.3726 32.0856C67.1802 31.6105 67.8216 30.9453 68.2967 30.0902C68.7718 29.2112 69.0093 28.166 69.0093 26.9545Z"
          fill="white"
        />
        <path
          d="M87.6711 37.1453C85.7707 37.1453 84.0604 36.7296 82.5401 35.8982C81.0198 35.043 79.8202 33.8434 78.9412 32.2993C78.0861 30.7553 77.6585 28.9737 77.6585 26.9545C77.6585 24.9354 78.0979 23.1538 78.9769 21.6097C79.8796 20.0657 81.1029 18.8779 82.647 18.0465C84.191 17.1913 85.9133 16.7637 87.8136 16.7637C89.714 16.7637 91.4362 17.1913 92.9803 18.0465C94.5244 18.8779 95.7358 20.0657 96.6148 21.6097C97.5175 23.1538 97.9688 24.9354 97.9688 26.9545C97.9688 28.9737 97.5056 30.7553 96.5791 32.2993C95.6765 33.8434 94.4412 35.043 92.8734 35.8982C91.3293 36.7296 89.5952 37.1453 87.6711 37.1453ZM87.6711 32.7982C88.5738 32.7982 89.4171 32.5844 90.201 32.1568C91.0087 31.7055 91.65 31.0403 92.1251 30.1614C92.6002 29.2825 92.8378 28.2135 92.8378 26.9545C92.8378 25.0779 92.3389 23.6407 91.3412 22.643C90.3673 21.6216 89.1677 21.1109 87.7424 21.1109C86.3171 21.1109 85.1175 21.6216 84.1435 22.643C83.1933 23.6407 82.7182 25.0779 82.7182 26.9545C82.7182 28.8312 83.1815 30.2802 84.1079 31.3016C85.0581 32.2993 86.2458 32.7982 87.6711 32.7982Z"
          fill="white"
        />
        <path
          d="M110.394 37.1453C108.493 37.1453 106.783 36.7296 105.263 35.8982C103.742 35.043 102.543 33.8434 101.664 32.2993C100.809 30.7553 100.381 28.9737 100.381 26.9545C100.381 24.9354 100.82 23.1538 101.699 21.6097C102.602 20.0657 103.825 18.8779 105.369 18.0465C106.913 17.1913 108.636 16.7637 110.536 16.7637C112.436 16.7637 114.159 17.1913 115.703 18.0465C117.247 18.8779 118.458 20.0657 119.337 21.6097C120.24 23.1538 120.691 24.9354 120.691 26.9545C120.691 28.9737 120.228 30.7553 119.302 32.2993C118.399 33.8434 117.164 35.043 115.596 35.8982C114.052 36.7296 112.318 37.1453 110.394 37.1453ZM110.394 32.7982C111.296 32.7982 112.14 32.5844 112.923 32.1568C113.731 31.7055 114.372 31.0403 114.848 30.1614C115.323 29.2825 115.56 28.2135 115.56 26.9545C115.56 25.0779 115.061 23.6407 114.064 22.643C113.09 21.6216 111.89 21.1109 110.465 21.1109C109.04 21.1109 107.84 21.6216 106.866 22.643C105.916 23.6407 105.441 25.0779 105.441 26.9545C105.441 28.8312 105.904 30.2802 106.83 31.3016C107.781 32.2993 108.968 32.7982 110.394 32.7982Z"
          fill="white"
        />
        <path
          d="M123.068 26.8833C123.068 24.8879 123.46 23.1181 124.244 21.5741C125.051 20.03 126.144 18.8423 127.522 18.0109C128.9 17.1795 130.432 16.7637 132.118 16.7637C133.401 16.7637 134.624 17.0488 135.788 17.6189C136.952 18.1653 137.879 18.9017 138.568 19.8281V10.4569H143.627V36.8246H138.568V33.9028C137.95 34.8767 137.083 35.6606 135.967 36.2545C134.85 36.8484 133.555 37.1453 132.083 37.1453C130.42 37.1453 128.9 36.7177 127.522 35.8626C126.144 35.0074 125.051 33.8078 124.244 32.2637C123.46 30.6959 123.068 28.9024 123.068 26.8833ZM138.603 26.9545C138.603 25.743 138.366 24.7097 137.891 23.8545C137.416 22.9756 136.774 22.3105 135.967 21.8591C135.159 21.384 134.292 21.1465 133.365 21.1465C132.439 21.1465 131.584 21.3722 130.8 21.8235C130.016 22.2748 129.375 22.94 128.876 23.8189C128.401 24.6741 128.163 25.6955 128.163 26.8833C128.163 28.071 128.401 29.1162 128.876 30.0189C129.375 30.8978 130.016 31.5748 130.8 32.0499C131.608 32.525 132.463 32.7626 133.365 32.7626C134.292 32.7626 135.159 32.5369 135.967 32.0856C136.774 31.6105 137.416 30.9453 137.891 30.0902C138.366 29.2112 138.603 28.166 138.603 26.9545Z"
          fill="white"
        />
        <path
          d="M156.054 37.1453C154.438 37.1453 152.989 36.8603 151.706 36.2901C150.424 35.6963 149.402 34.9005 148.642 33.9028C147.906 32.9051 147.502 31.8005 147.431 30.589H152.455C152.55 31.3492 152.918 31.9787 153.559 32.4775C154.224 32.9764 155.044 33.2258 156.018 33.2258C156.968 33.2258 157.705 33.0357 158.227 32.6557C158.774 32.2756 159.047 31.7886 159.047 31.1948C159.047 30.5534 158.714 30.0783 158.049 29.7695C157.408 29.4369 156.374 29.0806 154.949 28.7005C153.476 28.3442 152.265 27.976 151.315 27.5959C150.388 27.2158 149.58 26.6338 148.892 25.8499C148.226 25.066 147.894 24.0089 147.894 22.6787C147.894 21.586 148.203 20.5883 148.82 19.6856C149.462 18.7829 150.364 18.0703 151.528 17.5477C152.716 17.025 154.106 16.7637 155.697 16.7637C158.049 16.7637 159.926 17.3576 161.327 18.5454C162.729 19.7093 163.501 21.289 163.643 23.2844H158.869C158.797 22.5005 158.465 21.8829 157.871 21.4316C157.301 20.9565 156.529 20.7189 155.555 20.7189C154.652 20.7189 153.951 20.8852 153.452 21.2178C152.977 21.5503 152.74 22.0135 152.74 22.6074C152.74 23.2725 153.072 23.7833 153.738 24.1396C154.403 24.4722 155.436 24.8166 156.837 25.1729C158.263 25.5292 159.439 25.8974 160.365 26.2775C161.292 26.6576 162.087 27.2515 162.752 28.0591C163.441 28.843 163.798 29.8882 163.821 31.1948C163.821 32.335 163.501 33.3564 162.859 34.2591C162.242 35.1618 161.339 35.8744 160.151 36.397C158.987 36.8959 157.621 37.1453 156.054 37.1453Z"
          fill="white"
        />
        <path
          d="M172.905 19.935C173.546 19.0323 174.425 18.284 175.542 17.6902C176.682 17.0726 177.976 16.7637 179.425 16.7637C181.112 16.7637 182.632 17.1795 183.986 18.0109C185.364 18.8423 186.445 20.03 187.229 21.5741C188.037 23.0944 188.44 24.8641 188.44 26.8833C188.44 28.9024 188.037 30.6959 187.229 32.2637C186.445 33.8078 185.364 35.0074 183.986 35.8626C182.632 36.7177 181.112 37.1453 179.425 37.1453C177.976 37.1453 176.694 36.8484 175.577 36.2545C174.484 35.6606 173.594 34.9124 172.905 34.0097V46.2315H167.916V17.0844H172.905V19.935ZM183.345 26.8833C183.345 25.6955 183.096 24.6741 182.597 23.8189C182.122 22.94 181.48 22.2748 180.673 21.8235C179.889 21.3722 179.034 21.1465 178.107 21.1465C177.204 21.1465 176.349 21.384 175.542 21.8591C174.758 22.3105 174.116 22.9756 173.617 23.8545C173.142 24.7335 172.905 25.7668 172.905 26.9545C172.905 28.1423 173.142 29.1756 173.617 30.0545C174.116 30.9334 174.758 31.6105 175.542 32.0856C176.349 32.5369 177.204 32.7626 178.107 32.7626C179.034 32.7626 179.889 32.525 180.673 32.0499C181.48 31.5748 182.122 30.8978 182.597 30.0189C183.096 29.14 183.345 28.0948 183.345 26.8833Z"
          fill="white"
        />
        <path
          d="M190.783 26.8833C190.783 24.8879 191.175 23.1181 191.959 21.5741C192.766 20.03 193.847 18.8423 195.201 18.0109C196.579 17.1795 198.111 16.7637 199.798 16.7637C201.27 16.7637 202.553 17.0607 203.646 17.6545C204.762 18.2484 205.653 18.9967 206.318 19.8994V17.0844H211.342V36.8246H206.318V33.9384C205.677 34.8649 204.786 35.6369 203.646 36.2545C202.529 36.8484 201.235 37.1453 199.762 37.1453C198.099 37.1453 196.579 36.7177 195.201 35.8626C193.847 35.0074 192.766 33.8078 191.959 32.2637C191.175 30.6959 190.783 28.9024 190.783 26.8833ZM206.318 26.9545C206.318 25.743 206.081 24.7097 205.606 23.8545C205.131 22.9756 204.489 22.3105 203.681 21.8591C202.874 21.384 202.007 21.1465 201.08 21.1465C200.154 21.1465 199.299 21.3722 198.515 21.8235C197.731 22.2748 197.09 22.94 196.591 23.8189C196.116 24.6741 195.878 25.6955 195.878 26.8833C195.878 28.071 196.116 29.1162 196.591 30.0189C197.09 30.8978 197.731 31.5748 198.515 32.0499C199.322 32.525 200.178 32.7626 201.08 32.7626C202.007 32.7626 202.874 32.5369 203.681 32.0856C204.489 31.6105 205.131 30.9453 205.606 30.0902C206.081 29.2112 206.318 28.166 206.318 26.9545Z"
          fill="white"
        />
        <path
          d="M214.932 26.9545C214.932 24.9116 215.347 23.13 216.179 21.6097C217.01 20.0657 218.162 18.8779 219.635 18.0465C221.108 17.1913 222.795 16.7637 224.695 16.7637C227.142 16.7637 229.161 17.3814 230.752 18.6166C232.368 19.8281 233.449 21.5385 233.995 23.7476H228.614C228.329 22.8925 227.842 22.2273 227.154 21.7522C226.488 21.2534 225.657 21.004 224.659 21.004C223.234 21.004 222.106 21.5266 221.274 22.5718C220.443 23.5932 220.027 25.0542 220.027 26.9545C220.027 28.8312 220.443 30.2921 221.274 31.3373C222.106 32.3587 223.234 32.8695 224.659 32.8695C226.678 32.8695 227.997 31.9668 228.614 30.1614H233.995C233.449 32.2993 232.368 33.9978 230.752 35.2568C229.137 36.5158 227.118 37.1453 224.695 37.1453C222.795 37.1453 221.108 36.7296 219.635 35.8982C218.162 35.043 217.01 33.8553 216.179 32.335C215.347 30.7909 214.932 28.9974 214.932 26.9545Z"
          fill="white"
        />
        <path
          d="M256 26.5269C256 27.2396 255.952 27.881 255.857 28.4511H241.426C241.545 29.8764 242.044 30.9928 242.923 31.8005C243.802 32.6082 244.883 33.012 246.166 33.012C248.018 33.012 249.337 32.2162 250.121 30.6246H255.501C254.931 32.525 253.838 34.0928 252.223 35.3281C250.608 36.5396 248.624 37.1453 246.272 37.1453C244.372 37.1453 242.662 36.7296 241.141 35.8982C239.645 35.043 238.469 33.8434 237.614 32.2993C236.782 30.7553 236.367 28.9737 236.367 26.9545C236.367 24.9116 236.782 23.1181 237.614 21.5741C238.445 20.03 239.609 18.8423 241.106 18.0109C242.602 17.1795 244.325 16.7637 246.272 16.7637C248.149 16.7637 249.824 17.1676 251.297 17.9752C252.793 18.7829 253.945 19.935 254.753 21.4316C255.584 22.9043 256 24.6028 256 26.5269ZM250.833 25.1017C250.81 23.8189 250.346 22.7975 249.444 22.0373C248.541 21.2534 247.436 20.8614 246.13 20.8614C244.895 20.8614 243.849 21.2415 242.994 22.0017C242.163 22.7381 241.652 23.7714 241.462 25.1017H250.833Z"
          fill="white"
        />
      </svg>
      </div>

      <div
        class="chatbody"
        style={{
          height: "290px",
          width: "845px",
          margin: "20px 28px",
          position: "fixed",
        }}
      >
      
      {cm ?
      <>
      <MessageList
          class="mbox"
          scrollBehavior="smooth"
          typingIndicator={typing ? <TypingIndicator content="...." /> : null}
        >
          {messages.map((message, i) => {
            return <Message key={i} model={message} />;
          })}
        </MessageList>
        <MessageInput placeholder="Type message here" onSend={handleSend} /></>
        
        : <video className="camera" ref={videoRef}></video>}
  

     
        <div className="row vid">
          <div className="vdd col">
            <span>
              {!cm ? 
        <img className="aii" src={ai} alt="" />
       : <video className="camera2" ref={videoRef}></video>}
            </span>
            <span>
              {cm ? <img className="cam" src={cam} type="button" onClick={
                  () =>
                  {
                   setCm(false)
                   }
              }/>: <img className="cc" src={cc} type="button" alt="" onClick={
                () =>
                {
                 setCm(true)
                 }
            }/>}
                
            </span>
          </div>
          <div className="vdd2 col-lg-3">
            <span>
              {" "}
              
             <img
                className="pp"
                type="button"
                onClick={
                  () =>
                  {
                    if(isPaused) {
                      synth.resume();
                      setIsPaused(false);
                      }
                    else{
                    synth.pause();
                    setIsPaused(true);
                        }
                   }
              }
                src={pp}
                alt=""
              />
             
             {" "}
            </span>
          </div>
        </div>
      </div>
     
      <section class="airs">
        <img src={w} className="w" alt="" />
      </section>
    </div>
  );
}

export default App;
