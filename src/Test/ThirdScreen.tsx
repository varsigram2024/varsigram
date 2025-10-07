import ThirdScreenSvg from './ThirdScreen.svg'

// Simple React wrapper that renders the exported SVG file.
export default function ThirdScreen() {
  return (
    <div style={{ width: 430, height: 932 }}>
      <img src={ThirdScreenSvg} alt="Third screen design" width={430} height={932} />
    </div>
  )
}
