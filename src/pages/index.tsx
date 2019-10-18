import * as React from 'react';
import { graphql } from 'gatsby';

import { Helmet } from 'react-helmet';

import {
  AuthorsJsonConnection,
  CoursesJsonConnection,
  BundlesJsonConnection,
  TestimonialsJsonConnection
} from '../domain/graphql-types';

import {
  authorFromAuthorsJsonEdge,
  courseFromCoursesJsonEdge,
  testimonialFromTestimonialJsonEdge
} from '../domain/converters';

import Hero from '../components/home/Hero/Hero';
import { bundleFromBundlesJsonEdge } from '../domain/converters/bundle-types';

import BundleSection from '../components/home/BundleSection/BundleSection';
import CoursesSection from '../components/home/CoursesSection/CoursesSection';
import { CourseFilterType } from '../components/home/CourseFilter/CourseFilter';
import SubHeroSection from '../components/home/SubHeroSection/SubHeroSection';
import Benefits from '../components/home/Benefits/Benefits';
import Logos from '../components/home/Logos/Logos';

import SignUpSection from '../components/shared/SignUpSection/SignUpSection';
import AddThisBlock from '../components/shared/AddThisBlock/AddThisBlock';
import { scrollToElementById } from '../utils/scrolling';
import Testimonials from '../components/Testimonials/Testimonials';
import CountdownTimer from '../components/shared/CountdownTimer/CountdownTimer';
import TrainingLink from '../components/home/TrainingLink/TrainingLink';
import { MainLayout } from '../layouts/MainLayout';
import { Course } from '../domain/models';
import { Seo } from '../components/shared/Seo/Seo';
import { TrackSection } from '../components/home/TrackSection/TrackSection';
import { BrandsSection } from '../components/shared/Brands/BrandsSection';

// Please note that you can use https://github.com/dotansimha/graphql-code-generator
// to generate all types from graphQL schema
interface IndexPageProps {
  data: {
    authorsConnection: AuthorsJsonConnection;
    coursesConnection: CoursesJsonConnection;
    bundlesConnection: BundlesJsonConnection;
    testimonialsConnection: TestimonialsJsonConnection;
  };
}

interface IndexPageState {
  courses: Course[];
  selectedFilterType: CourseFilterType;
}

export default class extends React.Component<IndexPageProps, IndexPageState> {
  constructor(props: IndexPageProps) {
    super(props);

    const authors = this.props.data.authorsConnection.edges.map(
      authorFromAuthorsJsonEdge
    );

    const courses = this.props.data.coursesConnection.edges.map(c =>
      courseFromCoursesJsonEdge(c, authors)
    );

    this.state = {
      courses: courses,
      selectedFilterType: 'All'
    };
  }

  public componentDidMount() {
    this.mountAddThis();
  }

  private mountAddThis() {
    const script = document.createElement("script");
    script.src =
      `//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-597d29b3b4e298a5`;
    script.async = true;
    document.body.appendChild(script);
  }

  private freeCoursesSelected() {
    this.setState({ selectedFilterType: 'Free' }, () => {
      this.scrollToElementById('courses');
    });
  }

  private premiumCoursesSelected() {
    this.setState({ selectedFilterType: 'All' }, () => {
      this.scrollToElementById('courses');
    });
  }

  private scrollToElementById(id: string) {
    scrollToElementById(id);
  }

  private filterByFilterType(filterType: CourseFilterType) {
    this.setState({ selectedFilterType: filterType });
  }

  private getFilteredCourses(filterType: CourseFilterType): Course[] {
    switch (filterType) {
      case 'All':
        return this.state.courses;
      case 'Free':
        return this.state.courses.filter(c =>
          c.products.some(p => p.pricereg === 0)
        );
      case 'Core':
        return this.state.courses.filter(c => c.flavors.includes('Core'));
      case 'Angular':
        return this.state.courses.filter(c => c.flavors.includes('Angular'));
      case 'Vue':
        return this.state.courses.filter(c => c.flavors.includes('Vue'));
      default:
        return this.state.courses;
    }

    /*
        if (this.state.selectedFlavor === undefined) {
            return this.state.courses;
        } else {
            return this.state.courses.filter(c => c.flavors.includes(this.state.selectedFlavor));
        }
        */
  }

  public render() {
    const filteredCourses = this.getFilteredCourses(
      this.state.selectedFilterType
    );

    const bundles = this.props.data.bundlesConnection.edges.map(b =>
      bundleFromBundlesJsonEdge(b, this.state.courses)
    );

    const testimonials = this.props.data.testimonialsConnection.edges.map(
      testimonialFromTestimonialJsonEdge
    );

    const pageTitle = `Courses | NativeScripting`;

    return (
      <MainLayout>
        <Seo />
        <Helmet>
          <title>{pageTitle}</title>
        </Helmet>

        <CountdownTimer />

        <Hero />

        <TrackSection disabled={true} />

        <SubHeroSection
          onFreeCoursesClick={() => this.freeCoursesSelected()}
          onPremiumCoursesClick={() => this.premiumCoursesSelected()}
        />



        <BrandsSection disabled={false} />

        <Benefits />

        <a id="courses" />

        <CoursesSection
          courses={filteredCourses}
          selectedFilterType={this.state.selectedFilterType}
          onSelectFilterType={filterType => this.filterByFilterType(filterType)}
        />

        <BundleSection bundles={bundles} />

        <Logos />

        <Testimonials testimonials={testimonials} />

        <SignUpSection />

        <AddThisBlock />

        <TrainingLink />
      </MainLayout>
    );
  }
}

export const indexPageQuery = graphql`
  query IndexPageQuery {
    #get authors
    authorsConnection: allAuthorsJson(filter: { types: { in: "course" } }) {
      totalCount
      edges {
        node {
          id
          title
          name
          picture
          bio
          biolong
          twitter
          github
        }
      }
    }

    #get courses
    coursesConnection: allCoursesJson(sort: { order: ASC, fields: [order] }) {
      totalCount
      edges {
        node {
          id
          title
          flavors
          url
          label
          authors
          level
          order
          products {
            id
            name
            description
            licensesMin
            licensesMax
            pricereg
            pricesale
          }
        }
      }
    }

    #get bundles
    bundlesConnection: allBundlesJson {
      edges {
        node {
          id
          title
          subtitle
          description
          url
          promototal
          promoremaining
          courseIds
          bundleLevel
          products {
            id
            name
            description
            pricesale
            pricereg
            licensesMin
            licensesMax
          }
        }
      }
    }

    #get testimonials
    testimonialsConnection: allTestimonialsJson {
      totalCount
      edges {
        node {
          id
          name
          img
          twitter
          order
          quoteHtml
          titleHtml
        }
      }
    }
  }
`;
