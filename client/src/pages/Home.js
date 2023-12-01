import React from 'react';
import './Home.css';
import home1 from '../assits/home1.png';
import home2 from '../assits/home2.png';

const Home = () => {
  return (
    <div className="home-container">
      <div className="description-box">

        <h1>Welcome to AudioScribe - Your Audio Alchemist</h1>

        <div className="centered-content">
          <img src={home1} alt="Home1"/>
        </div>

        <p>
          Delve into the transformative power of AudioScribe, where we redefine the realm of audio transcription and text-to-speech (TTS) technologies. Our trailblazing web platform paves the way for users to convert YouTube videos into pristine audio effortlessly. But we go beyond mere conversions. We leverage top-tier automatic speech recognition (ASR) capabilities to transcribe these audio clips, presenting you with the potential to modify and fine-tune each transcription via an exceptionally user-centric interface. With AudioScribe, mastering your TTS training data and crafting breathtakingly natural voices has never been this straightforward.
        </p>
        <br></br>

        <h1>Unveiling AudioScribe's Robust Features</h1>

        <div className="centered-content">
          <img src={home2} alt="Home2"/>
        </div>

        <p>
          AudioScribe champions innovation, and it shows in our extensive feature set tailored to transform your TTS annotation endeavors. Say goodbye to tedious video downloading and conversion hassles; with just a few clicks, your favorite YouTube videos metamorphose into quality audio ready for transcription. At the core of our services is our unparalleled ASR technology, which not only promises swift transcriptions but ensures an accuracy that's second to none.

          Our platform is more than just tools; it's an experience. The intuitive interface of AudioScribe presents users with the unique chance to review and refine transcriptions effortlessly. From rectifying errors and introducing punctuation to formatting text, our system is primed for perfection. And for those looking to foster collaborative brilliance, AudioScribe offers seamless real-time teamwork, enabling simultaneous project contributions from various users, thus optimizing your annotation processes.

          Diversity meets utility when you're ready to export. AudioScribe supports multiple transcription formats, from CSV and JSON to simple plaintext, ensuring that your TTS training endeavors face no roadblocks. And when it comes to voice customization, stand poised to harness the impeccable annotated data from our platform, guiding TTS models to achieve voices that resonate with authenticity and character. Simply put, AudioScribe is your comprehensive solution, bringing transcription precision and voice customization within easy reach.
        </p>
        <br></br>

        <h1>Why AudioScribe?</h1>

        <p>
          Our commitment to excellence is unwavering. At AudioScribe, we recognize the unparalleled value of high-caliber annotated data, especially in crafting TTS voices that truly resonate. Our platform's architecture, from the foundational algorithms to the user interface, is meticulously designed to streamline every phase of the annotation process, be it video conversion, transcription, or voice training. Whether you're venturing into the world of TTS as a researcher, a developer, or simply an enthusiast, AudioScribe stands out as the beacon for precision and efficiency in voice annotation. Join us on this journey and experience transcription like never before.
        </p>
        <br></br><br></br><br></br><br></br></div>
    </div>
  );
}

export default Home;
