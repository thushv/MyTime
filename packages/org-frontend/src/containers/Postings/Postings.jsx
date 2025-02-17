import React, { useContext, useState, useEffect } from "react";
import NoJobs from "../../components/NoJobs";
import Page from "../../components/Page";
import Tabs from "../../components/Tabs";
import { useNavigate } from "react-router-dom";
import { PostingContext } from "../../context/PostingContext";
import Posting from "../../components/Posting";
import Loading from "../../components/Loading";
import { AuthContext } from "../../context/AuthContext";

function OpenAction({ applicants, onClick, index, appHover, setAppHover }) {
  return (
    <div className="flex mr-2 justify-center align-middle">
      {applicants ? (
        <span
          onMouseOver={() => setAppHover(index)}
          onMouseLeave={() => setAppHover(null)}
          className="relative mt-3.5 flex justify-center items-center h-5 w-5 hover:cursor-pointer text-[10px] font-semibold text-center bg-red-500 text-white rounded mr-4"
        >
          {applicants}
          {appHover === index && (
            <span className="absolute rounded-md py-1 px-2 z-10 left-[-110px] bottom-0 mt-4 inline-block bg-gray-600">
              {applicants} new applicant{applicants !== 1 && "s"}
            </span>
          )}
        </span>
      ) : null}
      <button
        className="text-gray-600 hover:text-primary underline text-[13px] font-semibold"
        onClick={onClick}
      >
        View
      </button>
    </div>
  );
}

function Postings() {
  const [tab, setTab] = useState("Open");
  const [filteredPostings, setFilteredPostings] = useState([]);
  const [appHover, setAppHover] = useState(null);
  const navigate = useNavigate();
  const { postings, updatePosting, postingLoading } =
    useContext(PostingContext);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (!postingLoading) {
      const status =
        tab === "Open" ? "open" : tab === "Pending" ? "pending" : "closed";
      console.log(postings);
      setFilteredPostings(
        postings.filter((posting) => posting.status === status)
      );
    }
  }, [postingLoading, tab]);

  const onPostingClick = (id) => {
    navigate(`/postings/${id}`);
  };

  return (
    <Page title="My Postings">
      <div className="relative bg-white rounded-xl shadow-md flex flex-col p-6 w-full flex-grow">
        <div className="flex justify-between mb-2">
          <p className="text-subText text-sm mb-4">
            Manage your postings here - new or old
          </p>
          <button
            className="rounded-lg border-[1px] h-[30px] border-primary text-primary px-3 text-xs py-0 hover:bg-primary hover:text-white"
            onClick={() => navigate("/postings/create")}
          >
            + New Posting
          </button>
        </div>
        <Tabs
          tabs={["Open", "Pending Action", "Closed"]}
          setTab={setTab}
          tab={tab}
        />
        {postingLoading ? (
          <div className="w-full h-full flex justify-center items-center">
            <Loading />
          </div>
        ) : filteredPostings.length === 0 ? (
          <NoJobs
            message1="No Postings Yet!"
            message2="Click New Posting to add a posting"
          />
        ) : (
          <div className="mt-4 overflow-auto">
            {filteredPostings.map((posting, i) => (
              <Posting
                item={posting}
                org={currentUser}
                key={i}
                br={i !== filteredPostings.length - 1}
                onClick={() => onPostingClick(posting.id)}
                action={
                  <OpenAction
                    applicants={
                      posting.applicants.filter(
                        (applicant) => applicant.status === "applied"
                      )?.length
                    }
                    onClick={() => onPostingClick(posting.id)}
                    index={i}
                    setAppHover={setAppHover}
                    appHover={appHover}
                  />
                }
              />
            ))}
          </div>
        )}
      </div>
    </Page>
  );
}

Postings.propTypes = {};

export default Postings;
