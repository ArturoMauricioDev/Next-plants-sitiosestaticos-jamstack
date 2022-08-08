import { getCategoryList, getPlant, getPlantList } from '@api'

import { AuthorCard } from '@components/AuthorCard'
import { Layout } from '@components/Layout'
import { PlantEntryInline } from '@components/PlantCollection'
import { RichText } from '@components/RichText'
import { Grid, Typography } from '@material-ui/core'

import { GetStaticProps, InferGetStaticPropsType } from 'next'
import Link from 'next/link'

type PathType = {
  params: {
    slug: string
  }
}
export const getStaticPaths = async () => {
  const entries = await getPlantList({ limit: 10 })
  const paths: PathType[] = entries.map((plant) => ({
    params: {
      slug: plant.slug,
    },
  }))
  return {
    paths,
    fallback: false,
    //404 en las entradas no encontradas
  }
}

type PlantEntryProps = {
  plant: Plant
  otherEntries: Plant[]
  categories: Category[]
}
export const getStaticProps: GetStaticProps<PlantEntryProps> = async ({
  params,
}) => {
  const slug = params?.slug
  if (typeof slug !== 'string') {
    return {
      notFound: true,
    }
  }
  try {
    const plant = await getPlant(slug)
    //sidebar
    const otherEntries = await getPlantList({ limit: 5 })
    const categories = await getCategoryList({ limit: 10 })

    return {
      props: {
        plant,
        otherEntries,
        categories,
      },
    }
  } catch (error) {
    return {
      notFound: true,
    }
  }
}

const PlantEntryPage = ({
  plant,
  otherEntries,
  categories,
}: InferGetStaticPropsType<typeof getStaticProps>) => {
  return (
    <Layout>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8} lg={9} component="article">
          <figure>
            <img width={952} src={plant.image.url} alt={plant.image.title} />
          </figure>
          <div className="px-12 pt-8">
            <Typography variant="h2">{plant.plantName}</Typography>
          </div>
          <div className="p-10">
            <RichText richText={plant.description} />
          </div>
        </Grid>
        <Grid item xs={12} md={4} lg={3} component="aside">
          <section>
            <Typography className="mb-4" variant="h5" component="h3">
              Recent posts
            </Typography>
            {otherEntries.map((plantEntry) => (
              <article className="mb-4" key={plantEntry.id}>
                <PlantEntryInline {...plantEntry} />
              </article>
            ))}
          </section>
          <section className="m-t10">
            <Typography className="mb-4" variant="h5" component="h3">
              Categories
            </Typography>
            <ul className="list">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link passHref href={`/category/${category.slug}`}>
                    <Typography component="a" variant="h6">
                      {category.title}
                    </Typography>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </Grid>
      </Grid>
      <section className="my-4 border-t-2 border-b-2 border-gray-200 pt-12 pb-7">
        <AuthorCard {...plant.author} />
      </section>
    </Layout>
  )
}

export default PlantEntryPage
