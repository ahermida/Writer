/*
   Helper Structs for handling POST requests to /users/ && /api/ Routes
*/
package routes

import (
    "log"
    "bytes"
    "regexp"
    "unicode"
    "net/smtp"
    "text/template"
    "github.com/ahermida/Writer/resourceGo/Config"
)

// struct for POST handler to /users/make
type newUserPost struct {
  Username  string `json:"username"`
  Password  string `json:"password"`
  FirstName string `json:"firstName"`
  LastName  string `json:"lastName"`
}

// struct for POST handler to /users/login
type userLogin struct {
  Username string `json:"username"`
  Password string `json:"password"`
}

// struct for POST response to /users/login -- failed request
type authFail struct {
  Success bool   `json:"success"`
  Message string `json:"message"`
}

// struct for POST response to /users/login -- successful request
type loginSuccess struct {
  Success bool   `json:"success"`
  Message string `json:"message"`
  Token   string `json:"token"`
}

type newUserSuccess struct {
  Success   bool   `json:"success"`
  Message   string `json:"message"`
  FirstName string `json:"firstName"`
}


// function to validate villanova email addresses
func checkEmail(email string) bool {
 	regex := regexp.MustCompile(`(?i)^[a-z0-9._%+\-]+@villanova\.edu`)
 	return regex.MatchString(email)
 }

// function to validate password
func checkPassword(password string) bool {
  var sevenPlus bool = len([]rune(password)) > 7
  var chars bool = false
  var nums bool = false
  for _, c := range password {
    if unicode.IsLetter(c) {
      chars = true
    } else if unicode.IsNumber(c) {
      nums = true
    }
  }
  return sevenPlus && chars && nums
}

// function to validate name fields
func checkNames(first, last string) bool {
  var valid bool = true;
  regex := regexp.MustCompile(`(?i)[a-z]+`)
  valid = regex.MatchString(first) && regex.MatchString(last)
  return valid
}

func sendEmail(email, link, name string) {
  ///Props to Nathan Leclaire for his post on Golang Emails
  var err error
  var doc bytes.Buffer

  const emailTemplate = `From: {{.From}}
Subject: {{.Subject}}
To: {{.To}}


{{.Body}}
{{.Link}}
Sincerely,
{{.From}}
  `

  context := &SmtpTemplateData{
       From: "Albert Hermida",
         To: email,
    Subject: "Authorize your account for Writer",
       Body: "Hey, Thanks for signing up! Click on the link to authorize your account:",
       Link: link,
  }
  t := template.New("emailTemplate")
  t, err = t.Parse(emailTemplate)
  if err != nil {
      log.Print("error trying to parse mail template")
  }
  err = t.Execute(&doc, context)
  if err != nil {
      log.Print("error trying to execute mail template")
  }

  auth := smtp.PlainAuth("",
    config.Email.Username,
    config.Email.Password,
    config.Email.EmailServer,
  )
  err = smtp.SendMail("smtp.gmail.com:587",
    auth,
    config.Email.Username,
    []string{email},
    doc.Bytes())

  if err != nil {
    log.Print("ERROR: attempting to send a mail ", err)
  }

}

type SmtpTemplateData struct {
    From    string
    To      string
    Subject string
    Body    string
    Link    string
}
