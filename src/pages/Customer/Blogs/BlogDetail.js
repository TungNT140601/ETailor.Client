import React, { useEffect, useState } from "react";
import Blog2 from "../../../assets/images/2011.i203.010..hobby cartoon set-06.jpg";
import "./blog.css";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import Loading from "../LoadingComponent/loading";
import NoBlog from '../../../assets/images/blog-not-found.jpg'
export default function BlogDetail() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  console.log("ID", id);
  const blogDetailUrl = `https://e-tailorapi.azurewebsites.net/api/blog/${id}`;

  const { data: blog, isLoading: loading } = useQuery("get-detail-blog", () =>
    fetch(blogDetailUrl, {}).then((response) => response.json())
  );
  console.log("BLOG DETAIL", blog);
  const BlogContent = ({ blog }) => {
    if (!blog || !blog.content) return null;

    return <div dangerouslySetInnerHTML={{ __html: blog.content }} />;
  };
  return (
    <>
      {" "}
      {isLoading ? (
        <div style={{ paddingTop: "340px" }}>
          <Loading />
        </div>
      ) : (
        <div style={{ paddingTop: "140px" }}>
          <div style={{ height: "60px", paddingLeft: "60px" }}>
            <nav
              className="breadcrumb has-bullet-separator"
              aria-label="breadcrumbs"
            >
              <ul>
                <li>
                  {" "}
                  <a href="#" style={{ color: "#000000" }}>
                    Trang Chủ
                  </a>
                </li>
                <li>
                  {" "}
                  <a href="#" style={{ color: "#000000" }}>
                    Bài Viết
                  </a>
                </li>
                <li className="is-active" style={{ fontWeight: "bold" }}>
                  {" "}
                  <a href="#" style={{ color: "#000000" }} aria-current="page">
                    Xu Hướng
                  </a>
                </li>
              </ul>
            </nav>
          </div>
          {blog ? (
            <div className="blog-wrapper-container">

              <div style={{ paddingLeft: "100px" }}>
                <div className="title-blog">
                  <p className="title is-1">{blog?.title}</p>

                  <div className="content-blog">

                    <BlogContent blog={blog} />


                  </div>
                </div>
              </div>


              <div style={{ position: "relative", minHeight: "100vh" }}>
                <div style={{ position: "absolute", right: 10 }}>
                  <div style={{ position: "fixed", top: "140px", right: "10px" }}>
                    <div
                      style={{
                        borderBottom: "2px solid ",
                        width: "fit-content",
                        paddingBottom: "3px",
                      }}
                    >
                      <p className="title is-3">Bài viết khác</p>
                    </div>

                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img src={Blog2} alt="" width={64} height={64}></img>
                      <div>
                        <span style={{ paddingLeft: "10px" }}>
                          Làm sao để thu hút ánh nhìn?
                        </span>
                        <p
                          className="blog-description"
                          style={{ paddingLeft: "10px" }}
                        >
                          10/1/2024
                        </p>
                      </div>
                    </div>
                    <hr style={{ width: "400px", margin: "10px" }} />
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img src={Blog2} alt="" width={64} height={64}></img>
                      <div>
                        <span style={{ paddingLeft: "10px" }}>
                          Làm sao để thu hút ánh nhìn?
                        </span>
                        <p
                          className="blog-description"
                          style={{ paddingLeft: "10px" }}
                        >
                          10/1/2024
                        </p>
                      </div>
                    </div>
                    <hr style={{ width: "400px", margin: "10px" }} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ justifyContent: "center", alignItems: "center", height: "fit-content", display: "flex" }}>
              <div>

                <p style={{ fontSize: 40, textAlign: "center" }}>Không tìm thấy bài viết</p>
                <img src={NoBlog} alt="blog" style={{ height: "65vh", objectFit: "contain" }} />
              </div>
            </div>

          )}
        </div>
      )}
    </>
  );
}
