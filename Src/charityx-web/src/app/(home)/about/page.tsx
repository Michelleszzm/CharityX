import Image from "next/image"
import bgImage from "@/assets/home/bg3.png"
import logoImage from "@/assets/home/logo3.png"
import JoshuaImage from "@/assets/home/people/Joshua.png"
import MichelleImage from "@/assets/home/people/Michelle.png"

export default function AboutPage() {
  const teamList = [
    {
      name: "Michelle",
      title: "Founder",
      description:
        "Michelle Zhou is a student at Oaks Christian School. As the founder of the Robot Learners League, she empowers underprivileged students, especially girls, to explore coding and robotics. As a VEX V5 competitor, she combines precision and creativity to solve real-world challenges. Through Stanford’s REAP and GYEL programs, she gains insights into rural education and global policy. She aims to merge technology with sociology to create meaningful social impact and develop innovative solutions which improve lives.",
      image: MichelleImage
    },
  ]
  return (
    <div className="relative">
      <div className="absolute top-0 left-0 h-[250px] w-full bg-[#FFF1C5]">
        <Image
          src={bgImage}
          alt="bg"
          width={3072}
          height={500}
          className="h-full w-auto"
        />
      </div>
      <div className="relative z-2">
        <div className="flex justify-center pt-12">
          <div className="w-[1280px]">
            <div className="text-[32px] leading-[39px] font-bold text-[#000]">
              About CharityX
            </div>
            <div className="mt-2 text-[16px] leading-[19px] text-[#000]">
              Empowering every nonprofit to participate in crypto philanthropy.
            </div>
          </div>
        </div>
        {/* cards */}
        <div className="flex justify-center">
          <div
            className="mt-12 flex w-[1280px] flex-col items-center rounded-2xl bg-white px-15 py-20"
            style={{
              border: "1px solid #E9E9E9",
              boxShadow: "0px 0px 16px 0px rgba(84,93,105,0.1)"
            }}
          >
            <Image
              src={logoImage}
              alt="logo"
              width={640}
              height={144}
              className="h-[72px] w-[320px]"
            />
            <div className="mt-16 w-[970px] text-center text-[44px] leading-[54px] font-bold text-[#020328]">
              Empowering every nonprofit to participate in crypto philanthropy.
            </div>
            <div className="mt-[62px] text-[18px] leading-[22px] text-[#020328]/65">
              Our mission: break barriers so every nonprofit can easily receive
              crypto donations with zero fees, automated receipts, and full
              transparency.
              <br />
              <br /> With just a few clicks, CharityX creates donation
              channels perfectly aligned with your brand. Built-in AI donation
              recommendations and anti-money laundering checks streamline the
              process, while real-time analytics help nonprofits track trends,
              boost fundraising efficiency, and maximize impact worldwide.
            </div>
            <div className="mt-20 flex w-full items-center gap-5">
              <div className="h-[1px] flex-1 bg-[#E9E9E9]"></div>
              <div className="text-[24px] leading-[29px] font-bold text-[#020328]">
                CharityX Team
              </div>
              <div className="h-[1px] flex-1 bg-[#E9E9E9]"></div>
            </div>

            <div className="mt-15 grid w-full grid-cols-1 gap-[70px]">
              {teamList.map(item => (
                <div key={item.name} className="flex items-start gap-10">
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={360}
                    height={360}
                    className="pointer-events-none size-[150px]"
                  />
                  <div>
                    <div className="text-[18px] leading-[22px] font-bold text-[#020328]">
                      {item.name}
                    </div>
                    <div className="mt-2 text-[18px] leading-[22px] text-[#020328]">
                      {item.title}
                    </div>
                    <div className="mt-4 text-[16px] leading-[19px] text-[#020328]/65">
                      {item.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
