import { Hero } from '../sections/Hero'
import { LatestBundles } from '../sections/LatestBundles'
import { HowItWorks } from '../sections/HowItWorks'
import { Promises } from '../sections/Promises'
import { CategoryGrid } from '../sections/CategoryGrid'
import { Faq } from '../sections/Faq'
import { FinalCta } from '../sections/FinalCta'

export default function Home() {
  return (
    <>
      <Hero />
      <LatestBundles />
      <HowItWorks />
      <Promises />
      <CategoryGrid />
      <Faq />
      <FinalCta />
    </>
  )
}
