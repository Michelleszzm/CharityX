"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import { cn } from "@/lib/utils"
import useUserStore from "@/store/userStore"
import useModalStore from "@/store/modalStore"

import bgImage from "@/assets/home/bg.png"
import bgLeftImage from "@/assets/home/bg-left.png"
import bgLeftImage1 from "@/assets/home/bg-left1.png"
import bgLeftImage2 from "@/assets/home/bg-left2.png"
import leftArrowImage from "@/assets/home/arrows-left.png"
import referralImage from "@/assets/home/referral.png"
import bgImage2 from "@/assets/home/bg2.png"
import step1Image from "@/assets/home/step1.png"
import step2Image from "@/assets/home/step2.png"
import step3Image from "@/assets/home/step3.png"
import explain1Image from "@/assets/home/explain1.png"
import explain2Image from "@/assets/home/explain2.png"
import explain3Image from "@/assets/home/explain3.png"

import showImage1 from "@/assets/home/showIcon/show1.png"
import showImage2 from "@/assets/home/showIcon/show2.png"
import showImage3 from "@/assets/home/showIcon/show3.png"
import showImage4 from "@/assets/home/showIcon/show4.png"
import showImage5 from "@/assets/home/showIcon/show5.png"
import showImage6 from "@/assets/home/showIcon/show6.png"
import showImage7 from "@/assets/home/showIcon/show7.png"
import showImage8 from "@/assets/home/showIcon/show8.png"
import checkRedIcon from "@/assets/home/checkRed.png"
import freeImage from "@/assets/home/free.png"
import bgImage4 from "@/assets/home/bg4.png"

export default function HomePage() {
  const { setRegisterModalOpen } = useModalStore()
  const { isLogined } = useUserStore()

  // carousel image state management
  const carouselImages = [bgLeftImage1, bgLeftImage2]
  const [currentIndex, setCurrentIndex] = useState(0)

  // automatically switch carousel image - support page visibility detection
  useEffect(() => {
    console.log(`CharityX Version: ${process.env.APP_VERSION} build: ${process.env.APP_BUILD_TIME}`)
    let timer: NodeJS.Timeout | null = null

    const startCarousel = () => {
      // clear the old timer if it exists
      if (timer) clearInterval(timer)
      // start a new timer
      timer = setInterval(() => {
        setCurrentIndex(prev => (prev + 1) % 2)
      }, 2000) // switch every 2 seconds
    }

    const stopCarousel = () => {
      if (timer) {
        clearInterval(timer)
        timer = null
      }
    }

    // listen to page visibility change
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        startCarousel()
      } else {
        stopCarousel()
      }
    }

    // initialize: if the page is currently visible, start the carousel
    if (document.visibilityState === "visible") {
      startCarousel()
    }

    // add visibility change listener
    document.addEventListener("visibilitychange", handleVisibilityChange)

    // clean up function
    return () => {
      stopCarousel()
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [])

  const list1 = [
    {
      icon: step1Image,
      step: "STEP 1",
      title: "Claim Your Free Account",
      description:
        "Sign up in just minutes and bring your mission to life. Set up your profile with your logo, colors, and story, and let your purpose shine."
    },
    {
      icon: step2Image,
      step: "STEP 2",
      title: "Launch Your Campaign",
      description:
        "Create a donation page that inspires action. Choose a template that fits your style, customize your form and payment options, and let AI suggest the perfect donation amounts."
    },
    {
      icon: step3Image,
      step: "STEP 3",
      title: "Share and Grow Impact",
      description:
        "Share your campaign and watch kindness grow. Send auto-receipts and NFTs, track donations in real time, and celebrate every act of generosity together."
    }
  ]
  const list2 = [
    {
      icon: explain1Image,
      title: "Effortlessly Customizable Fundraising Pages",
      description:
        "Create a powerful, brand-aligned fundraising website in minutes. Inspire generosity and make a lasting impact.",
      setStepList: [
        "Choose from multiple fundraising page templates",
        "Customize colors, logo, images, and copy to perfectly match your brand",
        "AI recommends popular crypto payment options and donation amounts to boost results"
      ]
    },
    {
      icon: explain2Image,
      title: "Donor - Focused Experience",
      description:
        "Provide a warm and transparent giving experience that keeps supporters engaged.",
      setStepList: [
        "Automatically send tax receipts and commemorative NFTs to enhance the donation experience",
        "Fully disclose how funds are used to build trust",
        "Display real-time donation activity so generosity is visible and confidence grows"
      ]
    },
    {
      icon: explain3Image,
      title: "Donor Management & Reports",
      description:
        "Use smart management tools to deepen donor relationships and make data-driven decisions.",
      setStepList: [
        "Manage all donors and transaction history in one place",
        "Segment and filter donors intelligently for targeted engagement",
        "Detailed reports showing donation trends, payment method distribution, donation amounts, and frequency"
      ]
    }
  ]
  const showList = [
    {
      icon: showImage1,
      title: "$1B+",
      description: "Total global crypto donations in 2024 — a record high."
    },
    {
      icon: showImage2,
      title: "1.9M+",
      description: "Total nonprofit organizations in the U.S."
    },
    {
      icon: showImage3,
      title: "Only 0.1%",
      description: "Can currently accept crypto donations directly."
    },
    {
      icon: showImage4,
      title: "100%",
      description:
        "Zero fees. Zero barriers. Every nonprofit deserves this power."
    },
    {
      icon: showImage5,
      title: "Global Giving, No Borders",
      description:
        "Reach supporters anywhere in the world and unlock new donation streams."
    },
    {
      icon: showImage6,
      title: "Built on Trust & Transparency",
      description:
        "Blockchain + AI AML checks ensure donations are secure and fully traceable."
    },
    {
      icon: showImage7,
      title: "Digital Currency Donation Trends",
      description:
        "A rising number of young supporters choose crypto, fueling the next wave of charitable impact."
    },
    {
      icon: showImage8,
      title: "Data-Driven Growth",
      description:
        "Track donation trends, chains, tokens, and donor behavior to drive smart decisions."
    }
  ]
  return (
    <>
      <div className="relative flex h-[640px] w-full items-center justify-center">
        <Image
          src={bgImage}
          alt="bg"
          width={3072}
          height={1120}
          className="absolute inset-0 z-[1] h-full w-full"
        />
        <div className="relative z-[2] mr-10 w-[560px]">
          <div className="relative">
            <div className="text-[44px] leading-[54px] font-bold text-[#000]">
              Build a secure, transparent crypto donation platform.
            </div>
            <Image
              src={freeImage}
              alt="free"
              width={240}
              height={240}
              className="absolute top-[-20px] right-[-10px] size-30"
            />
          </div>
          <div className="mt-6 text-[18px] leading-[24px] text-[#000]/80">
            With just a tap, build a donation platform that perfectly reflects
            your brand — where kindness travels instantly, and every crypto coin
            becomes a force for change.
          </div>
          {!isLogined && (
            <div
              onClick={() => setRegisterModalOpen(true)}
              className="group mt-10 flex h-[54px] w-[228px] cursor-pointer items-center justify-center rounded-full bg-[#FE5827] text-[18px] font-bold text-white hover:opacity-80"
            >
              Sign up for free
              <Image
                src={leftArrowImage}
                alt="left-arrow"
                width={48}
                height={48}
                className="ml-2 size-6 transition-all duration-300 group-hover:ml-3"
              />
            </div>
          )}
        </div>
        <div className="relative z-[2] flex h-[480px] w-[640px] items-center justify-center">
          {/* carousel image container */}
          <div className="pointer-events-none absolute z-[1] h-[300px] w-[481px] overflow-hidden">
            <AnimatePresence mode="sync" initial={false}>
              <motion.div
                key={currentIndex}
                initial={{ x: 481 }}
                animate={{ x: 0 }}
                exit={{ x: -481 }}
                transition={{
                  duration: 0.5,
                  ease: "easeInOut"
                }}
                className="absolute top-0 left-0 h-[300px] w-[481px]"
                style={{ willChange: "transform" }}
              >
                <Image
                  src={carouselImages[currentIndex]}
                  alt={`carousel-${currentIndex}`}
                  width={962}
                  height={600}
                  className="h-[300px] w-[481px] object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* static background layer */}
          <Image
            src={bgLeftImage}
            alt="bg-left"
            width={1280}
            height={960}
            className="pointer-events-none absolute top-0 left-0 z-[3] h-[480px] w-[640px] object-cover"
          />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center bg-white py-12">
        <div className="text-[40px] leading-[49px] font-bold text-[#020328]">
          Let crypto become a new force for good.
        </div>
        <div className="mt-4 text-[18px] leading-[22px] text-[#020328]/65">
          CharityX empowers every nonprofit to fundraise globally with ease.
          Together, we make impact borderless.
        </div>
        <div className="mt-12 grid w-[1000px] grid-cols-4 gap-x-[45px] gap-y-[48px] xl:w-[1230px] 2xl:gap-x-[90px]">
          {showList.map((item, index) => (
            <div key={index} className="flex flex-col items-center">
              <Image
                src={item.icon}
                alt={item.title}
                width={160}
                height={160}
                className="size-[64px]"
              />
              <div
                className={cn(
                  "mt-6 text-center font-bold text-[#020328]",
                  index < 3
                    ? "text-[24px] leading-[29px]"
                    : "text-[20px] leading-[24px]"
                )}
              >
                {index === 7 ? (
                  <div>
                    Data-Driven<br></br>Growth
                  </div>
                ) : (
                  item.title
                )}
              </div>
              <div className="mt-4 text-center text-[18px] leading-[22px] text-[#020328]/65">
                {item.description}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div className="relative flex h-[390px] w-full flex-col items-center justify-center bg-[#FFF1C5]">
          <Image
            src={bgImage4}
            alt="bg-image4"
            width={2560}
            height={622}
            className="absolute z-[1] h-full w-auto"
          />
          <div className="relative z-[2] flex items-start justify-center gap-[362px]">
            <div>
              <div className="text-[32px] leading-[39px] font-bold text-[#020328]">
                Traditional Methods
              </div>
              <div className="mt-6">
                <div className="flex items-center gap-4">
                  <div className="size-[6px] rounded-full bg-[#020328]"></div>
                  <div className="text-[18px] leading-[32px] text-[#020328]/80">
                    Geographical restrictions
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="size-[6px] rounded-full bg-[#020328]"></div>
                  <div className="text-[18px] leading-[32px] text-[#020328]/80">
                    High fees
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="size-[6px] rounded-full bg-[#020328]"></div>
                  <div className="text-[18px] leading-[32px] text-[#020328]/80">
                    Complicated approval & slow processing
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="size-[6px] rounded-full bg-[#020328]"></div>
                  <div className="text-[18px] leading-[32px] text-[#020328]/80">
                    Hard to build trust
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="text-[32px] leading-[39px] font-bold text-[#020328]">
                Crypto Charity
              </div>
              <div className="mt-6">
                <div className="flex items-center gap-4">
                  <Image
                    src={checkRedIcon}
                    alt="check-red"
                    width={36}
                    height={36}
                    className="size-[18px]"
                  />
                  <div className="text-[18px] leading-[32px] text-[#020328]/80">
                    Global, borderless acceptance
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Image
                    src={checkRedIcon}
                    alt="check-red"
                    width={36}
                    height={36}
                    className="size-[18px]"
                  />
                  <div className="text-[18px] leading-[32px] text-[#020328]/80">
                    Zero fees, full amount received
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Image
                    src={checkRedIcon}
                    alt="check-red"
                    width={36}
                    height={36}
                    className="size-[18px]"
                  />
                  <div className="text-[18px] leading-[32px] text-[#020328]/80">
                    Instant settlement
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Image
                    src={checkRedIcon}
                    alt="check-red"
                    width={36}
                    height={36}
                    className="size-[18px]"
                  />
                  <div className="text-[18px] leading-[32px] text-[#020328]/80">
                    Transparent & traceable + AI risk control
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center bg-white pt-[48px] pb-20">
        <div className="text-[40px] font-bold text-[#000]">How it works</div>
        <div className="mt-12 grid grid-cols-3 gap-16">
          {list1.map(item => (
            <div key={item.step} className="flex w-[362px] flex-col">
              <Image
                src={item.icon}
                width={724}
                height={428}
                alt={item.step}
                className="h-auto w-full"
              />
              <div className="mt-10 text-[14px] font-bold text-[#000]">
                {item.step}
              </div>
              <div className="mt-[8px] text-[22px] leading-[27px] font-bold text-[#000]">
                {item.title}
              </div>
              <div className="mt-4 text-[16px] leading-[24px] text-[#000]/80">
                {item.description}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        {list2.map((item, index) => (
          <motion.div
            key={index}
            custom={index}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: (i: number) => ({
                opacity: 1,
                y: 0,
                transition: {
                  delay: i * 0.1,
                  duration: 0.5
                }
              })
            }}
            className={cn(
              "flex h-[680px] w-full items-center justify-center gap-10",
              index % 2 !== 0 ? "flex-row-reverse bg-white" : "flex-row"
            )}
          >
            <Image
              src={item.icon}
              alt={item.title}
              width={1280}
              height={960}
              className="h-auto w-[640px] flex-none"
            />
            <div className="w-[680px]">
              <div className="text-[40px] font-bold text-[#000]">
                {item.title}
              </div>
              <div className="mt-6 text-[18px] leading-[24px] text-[#000]/80">
                {item.description}
              </div>

              <div className="mt-6">
                {item.setStepList.map((it, ind) => (
                  <div
                    key={ind}
                    className="flex items-start text-[16px] leading-[24px] text-[#000]/80"
                  >
                    <div className="relative top-2 mr-4 size-[6px] flex-none rounded-full bg-[#ACACAC]"></div>
                    {it}
                  </div>
                ))}
              </div>

              {!isLogined && (
                <div
                  onClick={() => setRegisterModalOpen(true)}
                  className="group mt-8 flex h-[54px] w-[228px] cursor-pointer items-center justify-center rounded-full bg-[#FE5827] text-[18px] font-bold text-white hover:opacity-80"
                >
                  Sign up for free
                  <Image
                    src={leftArrowImage}
                    alt="left-arrow"
                    width={48}
                    height={48}
                    className="ml-2 size-6 transition-all duration-300 group-hover:ml-3"
                  />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="relative flex h-[396px] items-center justify-between">
        <Image
          src={bgImage2}
          alt="bg-image2"
          width={3072}
          height={792}
          className="absolute inset-0 z-[1] h-full w-full"
        />
        <div className="relative z-2 flex w-full flex-col items-center justify-center">
          <div className="text-[44px] leading-[54px] font-bold text-[#000]">
            Let’s Grow Your Impact Together.
          </div>
          <div className="mt-6 text-[18px] leading-[24px] text-[#000]/80">
            Start raising more for free - request your free access to CharityX
            today!
          </div>
          {!isLogined && (
            <div
              onClick={() => setRegisterModalOpen(true)}
              className="group mt-10 flex h-[54px] w-[228px] cursor-pointer items-center justify-center rounded-full bg-[#FE5827] text-[18px] font-bold text-white hover:opacity-80"
            >
              Sign up for free
              <Image
                src={leftArrowImage}
                alt="left-arrow"
                width={48}
                height={48}
                className="ml-2 size-6 transition-all duration-300 group-hover:ml-3"
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
