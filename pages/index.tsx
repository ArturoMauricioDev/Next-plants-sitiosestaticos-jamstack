import { GetStaticProps, InferGetStaticPropsType } from 'next'

import { Layout } from '@components/Layout'
import { getPlantList } from './../api'
import { PlantCollection } from '@components/PlantCollection'
import { Hero } from '@components/Hero'
import { Authors } from '@components/Authors'

type HomeProps = { plants: Plant[] }

export const getStaticProps: GetStaticProps<HomeProps> = async () => {
  const plants = await getPlantList({ limit: 10 })
  return {
    props: {
      plants,
    },
  }
}

const Home = ({ plants }: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <Layout>
      <Hero {...plants[0]} className="mb-10" />
      <Authors className="mb-10" />
      <PlantCollection
        plants={plants.slice(1, 3)}
        variant="vertical"
        className="mb-24"
      />
      <PlantCollection
        plants={plants.length > 8 ? plants.slice(3, 9) : plants}
        variant="square"
      />
    </Layout>
  )
}

export default Home
