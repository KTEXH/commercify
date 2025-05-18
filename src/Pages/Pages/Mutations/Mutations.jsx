import { gql } from "@apollo/client";

export const LINK_CREATION = gql`
mutation CreateMultipleLinks($links: [LinkInput!]!) {
  createLinks(links: $links) {
    id
    linkText
    link
    image
  }
}
`

export const CREATE_LINK_IN_BIO = gql`
  mutation createPage(
     $name: String,
     $form: Boolean!,
     $storefront: Boolean!,
     $workshop: Boolean!,
     $linkinbio: Boolean!,
     $headerImage: String
  ) {
    createPage(
     name: $name,
     form: $form,
     storefront: $storefront,
     linkinbio: $linkinbio,
     workshop: $workshop,
     headerImage: $headerImage
    ) {
      id
    }
  }
`;

export const CREATE_STORE = gql`
  mutation updatePage(
  $id: Int!,
    $subdomain: String,
    $backgroundColor: String,
    $storefrontIsPasscode: Boolean,
    $storefrontPass: String,
    $newsletterSection: Boolean,
    $newsletterImage: String,
    $headerText: String,
    $secondaryText: String,
    $componentColor: String,
    $headingColor: String,
    $subTextColor: String,
    $embeddedLink: String,
    $grid: Boolean!,
    $featuredSection: Boolean,
    $socialsSection: Boolean,
    $actionButton: String,
    $actionButtonText: String,
    $linksSection: Boolean,
    $base: String,
    $rounded: String,
    $style: String,
    $newsletterSubText: String,
    $newsletterHeading: String,
    $instagramShown: Boolean,
    $tiktokShown: Boolean,
    $facebookShown: Boolean,
    $twitterShown: Boolean,
    $instagram: String,
    $styleColor: String,
    $facebook: String,
    $tiktok: String,
    $font: String,
    $twitter: String,
    $textColor: String,
    $published: Boolean!
    $baseText: String,
    $formType: String,
    $subscribeText: String,
    $subscribeSubText: String,
    $headerImage: String,
    $secondaryImage: String,
    $subText: String,
    $description: String,
    $template: Int
  ) {
    updatePage(
    id: $id,
      subdomain: $subdomain,
      textColor: $textColor,
      baseText: $baseText,
      backgroundColor: $backgroundColor,
      storefrontIsPasscode: $storefrontIsPasscode,
      storefrontPass: $storefrontPass,
      newsletterSection: $newsletterSection,
      newsletterImage: $newsletterImage,
      componentColor: $componentColor,
      headingColor: $headingColor,
      subTextColor: $subTextColor,
      published: $published
      embeddedLink: $embeddedLink,
      formType: $formType,
      featuredSection: $featuredSection,
      socialsSection: $socialsSection,
      rounded: $rounded,
      base: $base,
      grid: $grid,
      styleColor: $styleColor,
      style: $style,
      actionButton: $actionButton,
      actionButtonText: $actionButtonText,
      linksSection: $linksSection,
      newsletterSubText: $newsletterSubText,
      newsletterHeading: $newsletterHeading,
      instagramShown: $instagramShown,
      tiktokShown: $tiktokShown,
      facebookShown: $facebookShown,
      twitterShown: $twitterShown,
      instagram: $instagram,
      facebook: $facebook,
      tiktok: $tiktok,
      headerText: $headerText,
      secondaryText: $secondaryText,
      font: $font,
      twitter: $twitter,
      subscribeText: $subscribeText,
      subscribeSubText: $subscribeSubText,
      headerImage: $headerImage,
      secondaryImage: $secondaryImage,
      subText: $subText,
      description: $description,
      template: $template
    ) {
      id
      name
      subdomain
    }
  }
`;


export const DELETE_LINK = gql`
  mutation DeleteLink($id: Int!) {
    deleteLink(id: $id) {
      id
    }
  }
`;

export const UPDATE_LINK = gql`
  mutation UpdateLink($id: Int!, $link: String!, $linkText: String) {
    updateLink(id: $id, link: $link, linkText: $linkText) {
      id
      link
      linkText
      image
    }
  }
`;