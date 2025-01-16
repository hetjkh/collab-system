// this will show in header home / oc / id
import { usePathname } from 'next/navigation';
import React, { Fragment } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const BreadCrumbs = () => {
  const path = usePathname();// het the current path 
  const segments = path.split('/').filter(Boolean);// split the path

  return (
    <Breadcrumb className="py-4">
      <BreadcrumbList className="flex items-center space-x-1">
        <BreadcrumbItem className="inline-flex items-center">
          <BreadcrumbLink 
            href="/" 
            className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm font-medium"
          >
            Home
          </BreadcrumbLink>
        </BreadcrumbItem>

        {segments.map((segment, index) => {
          const href = `/${segments.slice(0, index + 1).join('/')}`; // we are herf fot the current segmenr 
          const isLast = index === segments.length - 1;// this will check is is the last segment or not
          
          return (
            <Fragment key={href}>
              <BreadcrumbSeparator className="text-gray-400 mx-1">
                /
              </BreadcrumbSeparator>
              <BreadcrumbItem className="inline-flex items-center">
                {isLast ? (
                  <BreadcrumbPage className="text-gray-900 font-semibold text-sm capitalize">
                    {segment}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink 
                    href={href}
                    className="text-gray-600 hover:text-gray-900 transition-colors duration-200 text-sm font-medium capitalize"
                  >
                    {segment}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumbs;