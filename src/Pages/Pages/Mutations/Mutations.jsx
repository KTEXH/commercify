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
    $backdrop: Boolean!,
    $headingColor: String,
    $subTextColor: String,
    $embeddedLink: String,
    $featuredSection: Boolean,
    $socialsSection: Boolean,
    $actionButton: String,
    $actionButtonText: String,
    $linksSection: Boolean,
    $newsletterSubText: String,
    $newsletterHeading: String,
    $instagramShown: Boolean,
    $tiktokShown: Boolean,
    $facebookShown: Boolean,
    $twitterShown: Boolean,
    $instagram: String,
    $facebook: String,
    $tiktok: String,
    $font: String,
    $twitter: String,
    $subscribeText: String,
    $subscribeSubText: String,
    $desc: Boolean!,
    $button: Boolean!,
    $simple: Boolean!,
    $headerImage: String,
    $secondaryImage: String,
    $subText: String,
    $description: String,
    $template: Int
  ) {
    updatePage(
    id: $id,
      subdomain: $subdomain,
      backgroundColor: $backgroundColor,
      storefrontIsPasscode: $storefrontIsPasscode,
      storefrontPass: $storefrontPass,
      newsletterSection: $newsletterSection,
      newsletterImage: $newsletterImage,
      componentColor: $componentColor,
      headingColor: $headingColor,
      subTextColor: $subTextColor,
      embeddedLink: $embeddedLink,
      featuredSection: $featuredSection,
      socialsSection: $socialsSection,
      actionButton: $actionButton,
      backdrop: $backdrop,
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
      button: $button,
      desc: $desc,
      simple: $simple,
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