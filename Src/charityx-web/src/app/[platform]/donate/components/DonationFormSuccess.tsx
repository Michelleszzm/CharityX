import Image from "next/image"
import pdfIcon from "@/assets/pdf.png"
import divisionIcon from "@/assets/division-icon.png"
import { ReceiptData } from "@/apis/donate"
import { formatAddress, formatAmount, formatDate, formatTxHash, saveImage, saveImageWithSite } from "@/lib/utils"
import { usePlatformData } from "../../components/PlatformContext"

interface Props {
  showTitle: boolean
  value: ReceiptData
}

export default function DonationFormSuccess({ showTitle, value }: Props) {
  const platformData = usePlatformData();

  const handleButtonClick = () => {
    saveImage(value.nftImage);
    // saveImage("https://picsum.photos/300", "test.png");
  };

  const handleDownloadPdf = () => {
    saveImageWithSite(platformData.data.publishValue.site, `${process.env.NEXT_PUBLIC_BASE_API}customer/donation/pdf/${value.txHash}`, `${value.txHash}.pdf`)
  }
  return (
    <div className="w-[400px]">
      {
        showTitle && (
          <div className="text-[16px] leading-[19px] font-bold text-[#020328]">
            Donation receipt & NFT Badge
          </div>
        )
      }
      <div className="mt-6 rounded-2xl bg-[#F7F7F7] px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="text-[14px] leading-[18px] text-[#020328]">
            {formatDate(value.payTime)}
          </div>
          <div className="flex items-center">
            <div className="mx-[2px] mb-1 text-[24px] leading-[29px] font-bold text-[#020328]">
              {formatAmount(value.amount)}
            </div>
            <div className="text-[14px] leading-[18px] text-[#020328]">USD</div>
          </div>
        </div>
        <div className="mt-4 rounded-[8px] bg-[#EDEDED] px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="text-[14px] leading-[32px] font-bold text-[#020328]">
              Transaction Hash
            </div>
            <div className="text-[14px] leading-[32px] text-[#020328]/65">
              {formatTxHash(value.txHash)}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-[14px] leading-[32px] font-bold text-[#020328]">
              Blockchain
            </div>
            <div className="text-[14px] leading-[32px] text-[#020328]/65">
              { value.chain }
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-[14px] leading-[32px] font-bold text-[#020328]">
              Donor Address
            </div>
            <div className="text-[14px] leading-[32px] text-[#020328]/65">
              { formatAddress(value.donorWallet) }
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-[14px] leading-[32px] font-bold text-[#020328]">
              Foundation Address
            </div>
            <div className="text-[14px] leading-[32px] text-[#020328]/65">
              { formatAddress(value.foundationWallet) }
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex h-[32px] w-[157px] cursor-pointer items-center justify-center rounded-[6px] border border-[#2777FF]" onClick={() => handleDownloadPdf()}>
            <Image src={pdfIcon} alt="pdf-icon" width={16} height={16} />
            <div className="ml-2 text-[12px] font-bold text-[#2777FF]">
              Download Receipt
            </div>
          </div>
          <div
            className="cursor-pointer text-[12px] text-[#2777FF]"
            onClick={() => {
              if (value.chain === "SOLANA") {
                window.open("https://solscan.io/tx/"+value.txHash, "_blank")
              } else if (value.chain === "ETHEREUM") {
                window.open("https://etherscan.io/tx/"+value.txHash, "_blank")
              }
            }}
          >
            View on Solana Explorer
          </div>
        </div>
        {
          value.nftId !== "" && (
            <>
              <div className="mx-[-16px] my-3">
                <Image
                  src={divisionIcon}
                  alt="division-icon"
                  width={904}
                  height={48}
                  className="h-auto w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="text-[16px] leading-[19px] font-bold text-[#020328]">
                  Commemorative NFT
                </div>
                <div className="cursor-pointer text-[14px] leading-[18px] font-bold text-[#2777FF]" onClick={() => handleButtonClick()}>
                  Save
                </div>
              </div>
              <div className="mt-3 flex flex-col items-center justify-center">
                <img
                  src={value.nftImage}
                  alt="commemorative-icon"
                  width={320}
                  height={320}
                  className="h-auto w-[160px]"
                />
                <div className="mt-4 w-[162px] text-[14px] leading-[18px] flex-col items-center justify-center font-bold text-[#020328]">
                  <div className="text-center">ID: {value.nftId}</div>
                  <div className="text-center">Owner: { formatAddress(value.donorWallet) }</div>
                </div>
                <div className="mt-2 text-[11px] leading-[14px] text-[#020328]/65">
                  Receipt & NFT are permanently recorded on the blockchain.
                </div>
              </div></>
          )
        }
      </div>
    </div>
  )
}
