import { Author } from "@/types/author";
import { Blog } from "@/types/blog";
import { Avatar, Col, Divider, List,Typography } from "antd";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import {  DeleteOutlined, EditOutlined} from '@ant-design/icons';


export const getServerSideProps: GetServerSideProps = async ({
  query
}) => {
 const res= await fetch(`https://jsonplaceholder.typicode.com/users?id=${query.id}`);
 const user: Array<Author> = await res.json();
 return {
   props: { 
    user: user[0],
  },
 };
};

type DetailProps = {
  user: Author,
}

const Detail: React.FC<DetailProps> = ({ user }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [blogs, setBlogs] = useState<Array<Blog>>([]);
  const [total, setTotal] = useState(0)

  useEffect(() => {
    fetchData({currentPage, pageSize: 25})
      .then(res => {
        setBlogs(res.data)
        if(res.total)
        setTotal(parseInt(res.total))
      })
  },[]);

  type FetchDataProps = {
    currentPage: number,
    pageSize: number
  }
  const fetchData = async ({ currentPage, pageSize}: FetchDataProps) => {
    const res = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${1}&_page=${currentPage}&_limit=${pageSize}`);
    const data: Array<Blog> = await res.json();
    const total = await res.headers.get('X-Total-Count')
    return {
      data,
      total
    }
  }

  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", marginTop: "20px", flexDirection:"column"}}>
      <Avatar>{user.name[0].toUpperCase()}</Avatar>
      <Typography>{user.name}</Typography>
      <Typography>{user.username}</Typography>
      <Typography>{user.email}</Typography>
      <Divider />
      {
        !blogs.length && <h2>Loadin ...</h2>
      }
      <Col span={12}>
        <List
          itemLayout="vertical"
          size="large"
          pagination={{
            onChange: onPageChange,
            pageSize: 25,
            total: total,
            showSizeChanger: false
          }}
          dataSource={blogs}
          renderItem={(item) => (
            <List.Item
              key={item.title}
              actions={[
                <EditOutlined title='Edit' onClick={() => null}/>,
                <DeleteOutlined style={{ color: "red"}}/>,
              ]}
            >
              <List.Item.Meta
                avatar={<Avatar>{user.name[0].toUpperCase()}</Avatar>}
                description={item.title}
              />
              {item.body}
            </List.Item>
          )}
          style={{paddingTop: "20px", paddingBottom: "40px"}}
        />
      </Col>
    </div>
  )
}

export default Detail